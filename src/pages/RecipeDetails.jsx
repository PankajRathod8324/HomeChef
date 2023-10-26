import React, { useEffect, useState } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import ConfirmationModal from "../components/common/ConfirmationModal"
import Footer from "../components/container/Footer/Footer"
import RatingStars from "../components/common/RatingStars"
import RecipeAccordionBar from "../components/core/Recipe/RecipeAccordionBar"
import RecipeDetailsCard from "../components/core/Recipe/RecipeDetailsCard"
import { formatDate } from "../services/formatDate"
import { fetchRecipeDetails } from "../services/operations/recipeDetailsAPI"
import { BuyRecipe } from "../services/operations/customerFeaturesAPI"
import GetAvgRating from "../utils/avgRating"
import Error from "./Error"

function RecipeDetails() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.profile)
  const { paymentLoading } = useSelector((state) => state.recipe)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Getting recipeId from url parameter
  const { recipeId } = useParams()
  // console.log(`recipe id: ${recipeId}`)

  // Declear a state to save the recipe details
  const [response, setResponse] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)
  useEffect(() => {
    // Calling fetchRecipeDetails fucntion to fetch the details
    ;(async () => {
      try {
        const res = await fetchRecipeDetails(recipeId)
        // console.log("recipe details res: ", res)
        setResponse(res)
      } catch (error) {
        console.log("Could not fetch Recipe Details")
      }
    })()
  }, [recipeId])

  // console.log("response: ", response)

  // Calculating Avg Review count
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  useEffect(() => {
    const count = GetAvgRating(response?.data?.recipeDetails.ratingAndReviews)
    setAvgReviewCount(count)
  }, [response])
  // console.log("avgReviewCount: ", avgReviewCount)

  // // Collapse all
  // const [collapse, setCollapse] = useState("")
  const [isActive, setIsActive] = useState(Array(0))
  const handleActive = (id) => {
    // console.log("called", id)
    setIsActive(
      !isActive.includes(id)
        ? isActive.concat([id])
        : isActive.filter((e) => e != id)
    )
  }

  // Total number of lectures
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)
  useEffect(() => {
    let lectures = 0
    response?.data?.recipeDetails?.recipeContent?.forEach((sec) => {
      lectures += sec.subSection.length || 0
    })
    setTotalNoOfLectures(lectures)
  }, [response])

  if (loading || !response) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center" style={{ fontFamily: 'Cormorant Upright, sans-serif' }}>
        <div className="spinner"></div>
      </div>
    )
  }
  if (!response.success) {
    return <Error />
  }

  const {
    _id: recipe_id,
    recipeName,
    recipeDescription,
    thumbnail,
    price,
    ingredients,
    recipeContent,
    ratingAndReviews,
    cook,
    customersEnroled,
    createdAt,
  } = response.data?.recipeDetails

  const handleBuyRecipe = () => {
    if (token) {
      BuyRecipe(token, [recipeId], user, navigate, dispatch)
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Recipe.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  if (paymentLoading) {
    // console.log("payment loading")
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center" style={{ fontFamily: 'Cormorant Upright, sans-serif' }}>
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <>
      <div className={`relative w-full bg-richblack-800`} style={{ fontFamily: 'Cormorant Upright, sans-serif' }}>
        {/* Hero Section */}
        <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative ">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
            <div className="relative block max-h-[30rem] lg:hidden">
              <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
              <img
                src={thumbnail}
                alt="recipe thumbnail"
                className="aspect-auto w-full"
              />
            </div>
            <div
              className={`z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5`}
            >
              <div>
                <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">
                  {recipeName}
                </p>
              </div>
              <p className={`text-richblack-200`}>{recipeDescription}</p>
              <div className="text-md flex flex-wrap items-center gap-2">
                <span className="text-yellow-25">{avgReviewCount}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                <span>{`(${ratingAndReviews.length} reviews)`}</span>
                <span>{`${customersEnroled.length} customers enrolled`}</span>
              </div>
              <div>
                <p className="">
                  Created By {`${cook.firstName} ${cook.lastName}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-5 text-lg">
                <p className="flex items-center gap-2">
                  {" "}
                  <BiInfoCircle /> Created at {formatDate(createdAt)}
                </p>
                <p className="flex items-center gap-2">
                  {" "}
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
              <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
                Rs. {price}
              </p>
              <button className="yellowButton" onClick={handleBuyRecipe}>
                Buy Now
              </button>
              <button className="blackButton">Saved Recipe</button>
            </div>
          </div>
          {/* Recipes Card */}
          <div className="right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block" style={{ fontFamily: 'Cormorant Upright, sans-serif' }}>
            <RecipeDetailsCard
              recipe={response?.data?.recipeDetails}
              setConfirmationModal={setConfirmationModal}
              handleBuyRecipe={handleBuyRecipe}
            />
          </div>
        </div>
      </div>
      <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]" style={{ fontFamily: 'Cormorant Upright, sans-serif' }}>
        <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
          {/* What will you learn section */}
          <div className="my-8 border border-richblack-600 p-8">
            <p className="text-3xl font-semibold">ingredients</p>
            <div className="mt-5">
              <ReactMarkdown>{ingredients}</ReactMarkdown>
            </div>
          </div>

          {/* Recipe Content Section */}
          <div className="max-w-[830px] " style={{ fontFamily: 'Cormorant Upright, sans-serif' }}>
            <div className="flex flex-col gap-3">
              <p className="text-[28px] font-semibold">Recipe Content</p>
              <div className="flex flex-wrap justify-between gap-2">
                <div className="flex gap-2">
                  <span>
                    {recipeContent.length} {`section(s)`}
                  </span>
                  <span>
                    {totalNoOfLectures} {`lecture(s)`}
                  </span>
                  <span>{response.data?.totalDuration} total length</span>
                </div>
                <div>
                  <button
                    className="text-yellow-25"
                    onClick={() => setIsActive([])}
                  >
                    Collapse all sections
                  </button>
                </div>
              </div>
            </div>

            {/* Recipe Details Accordion */}
            <div className="py-4">
              {recipeContent?.map((recipe, index) => (
                <RecipeAccordionBar
                  recipe={recipe}
                  key={index}
                  isActive={isActive}
                  handleActive={handleActive}
                />
              ))}
            </div>

            {/* Author Details */}
            <div className="mb-12 py-4" style={{ fontFamily: 'Cormorant Upright, sans-serif' }}>
              <p className="text-[28px] font-semibold">Chef</p>
              <div className="flex items-center gap-4 py-4">
                <img
                  src={
                    cook.image
                      ? cook.image
                      : `https://api.dicebear.com/5.x/initials/svg?seed=${cook.firstName} ${cook.lastName}`
                  }
                  alt="Author"
                  className="h-14 w-14 rounded-full object-cover"
                />
                <p className="text-lg">{`${cook.firstName} ${cook.lastName}`}</p>
              </div>
              <p className="text-richblack-50">
                {cook?.additionalDetails?.about}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default RecipeDetails