import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserEnrolledRecipes } from '../../../services/operations/profileAPI';
import ProgressBar from '@ramonak/react-progress-bar';
import { useNavigate } from "react-router-dom"

export default function EnrolledRecipes() {
    const { token } = useSelector((state) => state.auth)
    const navigate = useNavigate()
  
    const [enrolledRecipes, setEnrolledRecipes] = useState(null)
  
    useEffect(() => {
      ;(async () => {
        try {
          const res = await getUserEnrolledRecipes(token) // Getting all the published and the drafted recipes
  
          // Filtering the published recipe out
          const filterPublishRecipe = res.filter((ele) => ele.status !== "Draft")
          // console.log(
          //   "Viewing all the couse that is Published",
          //   filterPublishRecipe
          // )
  
          setEnrolledRecipes(filterPublishRecipe)
        } catch (error) {
          console.log("Could not fetch enrolled recipes.")
        }
      })()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  
    return (
      <>
        <div className="text-3xl text-richblack-50">Enrolled Recipes</div>
        {!enrolledRecipes ? (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
          </div>
        ) : !enrolledRecipes.length ? (
          <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
            You have not enrolled in any recipe yet.
            {/* TODO: Modify this Empty State */}
          </p>
        ) : (
          <div className="my-8 text-richblack-5">
            {/* Headings */}
            <div className="flex rounded-t-lg bg-richblack-500 ">
              <p className="w-[45%] px-5 py-3">Recipe Name</p>
              <p className="w-1/4 px-2 py-3">Duration</p>
              <p className="flex-1 px-2 py-3">Progress</p>
            </div>
            {/* Recipe Names */}
            {enrolledRecipes.map((recipe, i, arr) => (
              <div
                className={`flex items-center border border-richblack-700 ${
                  i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
                }`}
                key={i}
              >
                <div
                  className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                  onClick={() => {
                    navigate(
                      `/view-recipe/${recipe?._id}/section/${recipe.recipeContent?.[0]?._id}/sub-section/${recipe.recipeContent?.[0]?.subSection?.[0]?._id}`
                    )
                  }}
                >
                  <img
                    src={recipe.thumbnail}
                    alt="recipe_img"
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div className="flex max-w-xs flex-col gap-2">
                    <p className="font-semibold">{recipe.recipeName}</p>
                    <p className="text-xs text-richblack-300">
                      {recipe.recipeDescription.length > 50
                        ? `${recipe.recipeDescription.slice(0, 50)}...`
                        : recipe.recipeDescription}
                    </p>
                  </div>
                </div>
                <div className="w-1/4 px-2 py-3">{recipe?.totalDuration}</div>
                <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                  <p>Progress: {recipe.progressPercentage || 0}%</p>
                  <ProgressBar
                    completed={recipe.progressPercentage || 0}
                    height="8px"
                    isLabelVisible={false}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    )
  }
  