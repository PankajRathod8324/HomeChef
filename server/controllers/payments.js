const { instance } = require("../config/razorpay")
const Recipe = require("../models/Recipe")
const crypto = require("crypto")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const mongoose = require("mongoose")
const {
  recipeEnrollmentEmail,
} = require("../mail/templates/recipeEnrollmentEmail")
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
const RecipeProgress = require("../models/RecipeProgress")

// Capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  const { recipes } = req.body
  const userId = req.user.id
  if (recipes.length === 0) {
    return res.json({ success: false, message: "Please Provide Recipe ID" })
  }

  let total_amount = 0

  for (const recipe_id of recipes) {
    let recipe
    try {
      // Find the recipe by its ID
      recipe = await Recipe.findById(recipe_id)

      // If the recipe is not found, return an error
      if (!recipe) {
        return res
          .status(200)
          .json({ success: false, message: "Could not find the Recipe" })
      }

      // Check if the user is already enrolled in the recipe
      const uid = new mongoose.Types.ObjectId(userId)
      if (recipe.customersEnroled.includes(uid)) {
        return res
          .status(200)
          .json({ success: false, message: "Customer is already Enrolled" })
      }

      // Add the price of the recipe to the total amount
      total_amount += recipe.price
    } catch (error) {
      console.log(error)
      return res.status(500).json({ success: false, message: error.message })
    }
  }

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  }

  try {
    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options)
    console.log(paymentResponse)
    res.json({
      success: true,
      data: paymentResponse,
    })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." })
  }
}

// verify the payment
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id
  const razorpay_payment_id = req.body?.razorpay_payment_id
  const razorpay_signature = req.body?.razorpay_signature
  const recipes = req.body?.recipes

  const userId = req.user.id

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !recipes ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature === razorpay_signature) {
    await enrollCustomers(recipes, userId, res)
    return res.status(200).json({ success: true, message: "Payment Verified" })
  }

  return res.status(200).json({ success: false, message: "Payment Failed" })
}

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledCustomer = await User.findById(userId)

    await mailSender(
      enrolledCustomer.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledCustomer.firstName} ${enrolledCustomer.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
  } catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}

// enroll the customer in the recipes
const enrollCustomers = async (recipes, userId, res) => {
  if (!recipes || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please Provide Recipe ID and User ID" })
  }

  for (const recipeId of recipes) {
    try {
      // Find the recipe and enroll the customer in it
      const enrolledRecipe = await Recipe.findOneAndUpdate(
        { _id: recipeId },
        { $push: { customersEnroled: userId } },
        { new: true }
      )

      if (!enrolledRecipe) {
        return res
          .status(500)
          .json({ success: false, error: "Recipe not found" })
      }
      console.log("Updated recipe: ", enrolledRecipe)

      const recipeProgress = await RecipeProgress.create({
        recipeID: recipeId,
        userId: userId,
        completedVideos: [],
      })
      // Find the customer and add the recipe to their list of enrolled recipes
      const enrolledCustomer = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            recipes: recipeId,
            recipeProgress: recipeProgress._id,
          },
        },
        { new: true }
      )

      console.log("Enrolled customer: ", enrolledCustomer)
      // Send an email notification to the enrolled customer
      const emailResponse = await mailSender(
        enrolledCustomer.email,
        `Successfully Enrolled into ${enrolledRecipe.recipeName}`,
        recipeEnrollmentEmail(
          enrolledRecipe.recipeName,
          `${enrolledCustomer.firstName} ${enrolledCustomer.lastName}`
        )
      )

      console.log("Email sent successfully: ", emailResponse.response)
    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false, error: error.message })
    }
  }
}