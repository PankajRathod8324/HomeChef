const Recipe = require("../models/Recipe")
const Category = require("../models/Category")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const RecipeProgress = require("../models/RecipeProgress")
const { convertSecondsToDuration } = require("../utils/secToDuration")
// Function to create a new recipe
exports.createRecipe = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id

    // Get all required fields from request body
    let {
      recipeName,
      recipeDescription,
      ingredients,
      price,
      tag: _tag,
      category,
      status,
      instructions: _instructions,
    } = req.body
    // Get thumbnail image from request files
    const thumbnail = req.files.thumbnailImage

    // Convert the tag and instructions from stringified Array to Array
    const tag = JSON.parse(_tag)
    const instructions = JSON.parse(_instructions)

    console.log("tag", tag)
    console.log("instructions", instructions)

    // Check if any of the required fields are missing
    if (
      !recipeName ||
      !recipeDescription ||
      !ingredients ||
      !price ||
      !tag.length ||
      !thumbnail ||
      !category ||
      !instructions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      })
    }
    if (!status || status === undefined) {
      status = "Draft"
    }
    // Check if the user is an cook
    const cookDetails = await User.findById(userId, {
      accountType: "Cook",
    })

    if (!cookDetails) {
      return res.status(404).json({
        success: false,
        message: "Cook Details Not Found",
      })
    }

    // Check if the tag given is valid
    const categoryDetails = await Category.findById(category)
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      })
    }
    // Upload the Thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    )
    console.log(thumbnailImage)
    // Create a new recipe with the given details
    const newRecipe = await Recipe.create({
      recipeName,
      recipeDescription,
      cook: cookDetails._id,
      ingredients: ingredients,
      price,
      tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      instructions,
    })

    // Add the new recipe to the User Schema of the Cook
    await User.findByIdAndUpdate(
      {
        _id: cookDetails._id,
      },
      {
        $push: {
          recipes: newRecipe._id,
        },
      },
      { new: true }
    )
    // Add the new recipe to the Categories
    const categoryDetails2 = await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          recipes: newRecipe._id,
        },
      },
      { new: true }
    )
    console.log("HEREEEEEEEE", categoryDetails2)
    // Return the new recipe and a success message
    res.status(200).json({
      success: true,
      data: newRecipe,
      message: "Recipe Created Successfully",
    })
  } catch (error) {
    // Handle any errors that occur during the creation of the recipe
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to create recipe",
      error: error.message,
    })
  }
}
// Edit Recipe Details
exports.editRecipe = async (req, res) => {
  try {
    const { recipeId } = req.body
    const updates = req.body
    const recipe = await Recipe.findById(recipeId)

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      recipe.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          recipe[key] = JSON.parse(updates[key])
        } else {
          recipe[key] = updates[key]
        }
      }
    }

    await recipe.save()

    const updatedRecipe = await Recipe.findOne({
      _id: recipeId,
    })
      .populate({
        path: "cook",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "recipeContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.json({
      success: true,
      message: "Recipe updated successfully",
      data: updatedRecipe,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
// Get Recipe List
exports.getAllRecipes = async (req, res) => {
  try {
    const allRecipes = await Recipe.find(
      { status: "Published" },
      {
        recipeName: true,
        price: true,
        thumbnail: true,
        cook: true,
        ratingAndReviews: true,
        customersEnrolled: true,
      }
    )
      .populate("cook")
      .exec()

    return res.status(200).json({
      success: true,
      data: allRecipes,
    })
  } catch (error) {
    console.log(error)
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Recipe Data`,
      error: error.message,
    })
  }
}
// Get One Single Recipe Details
// exports.getRecipeDetails = async (req, res) => {
//   try {
//     const { recipeId } = req.body
//     const recipeDetails = await Recipe.findOne({
//       _id: recipeId,
//     })
//       .populate({
//         path: "cook",
//         populate: {
//           path: "additionalDetails",
//         },
//       })
//       .populate("category")
//       .populate("ratingAndReviews")
//       .populate({
//         path: "recipeContent",
//         populate: {
//           path: "subSection",
//         },
//       })
//       .exec()
//     // console.log(
//     //   "###################################### recipe details : ",
//     //   recipeDetails,
//     //   recipeId
//     // );
//     if (!recipeDetails || !recipeDetails.length) {
//       return res.status(400).json({
//         success: false,
//         message: `Could not find recipe with id: ${recipeId}`,
//       })
//     }

//     if (recipeDetails.status === "Draft") {
//       return res.status(403).json({
//         success: false,
//         message: `Accessing a draft recipe is forbidden`,
//       })
//     }

//     return res.status(200).json({
//       success: true,
//       data: recipeDetails,
//     })
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     })
//   }
// }
exports.getRecipeDetails = async (req, res) => {
  try {
    const { recipeId } = req.body
    const recipeDetails = await Recipe.findOne({
      _id: recipeId,
    })
      .populate({
        path: "cook",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "recipeContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec()

    if (!recipeDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find recipe with id: ${recipeId}`,
      })
    }

    // if (recipeDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft recipe is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    recipeDetails.recipeContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        recipeDetails,
        totalDuration,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
exports.getFullRecipeDetails = async (req, res) => {
  try {
    const { recipeId } = req.body
    const userId = req.user.id
    const recipeDetails = await Recipe.findOne({
      _id: recipeId,
    })
      .populate({
        path: "cook",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "recipeContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    let recipeProgressCount = await RecipeProgress.findOne({
      recipeID: recipeId,
      userId: userId,
    })

    console.log("recipeProgressCount : ", recipeProgressCount)

    if (!recipeDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find recipe with id: ${recipeId}`,
      })
    }

    // if (recipeDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft recipe is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    recipeDetails.recipeContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        recipeDetails,
        totalDuration,
        completedVideos: recipeProgressCount?.completedVideos
          ? recipeProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get a list of Recipe for a given Cook
exports.getCookRecipes = async (req, res) => {
  try {
    // Get the cook ID from the authenticated user or request body
    const cookId = req.user.id

    // Find all recipes belonging to the cook
    const cookRecipes = await Recipe.find({
      cook: cookId,
    }).sort({ createdAt: -1 })

    // Return the cook's recipes
    res.status(200).json({
      success: true,
      data: cookRecipes,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve cook recipes",
      error: error.message,
    })
  }
}
// Delete the Recipe
exports.deleteRecipe = async (req, res) => {
  try {
    const { recipeId } = req.body

    // Find the recipe
    const recipe = await Recipe.findById(recipeId)
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }

    // Unenroll customers from the recipe
    const customersEnrolled = recipe.customersEnroled
    for (const customerId of customersEnrolled) {
      await User.findByIdAndUpdate(customerId, {
        $pull: { recipes: recipeId },
      })
    }

    // Delete sections and sub-sections
    const recipeSections = recipe.recipeContent
    for (const sectionId of recipeSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the recipe
    await Recipe.findByIdAndDelete(recipeId)

    return res.status(200).json({
      success: true,
      message: "Recipe deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}