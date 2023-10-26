import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import {
  fetchRecipeDetails,
  getFullDetailsOfRecipe,
} from "../../../../services/operations/recipeDetailsAPI"
import { setRecipe, setEditRecipe } from "../../../../slices/recipeSlice"
import RenderSteps from "../AddRecipe/RenderSteps"

export default function EditRecipe() {
  const dispatch = useDispatch()
  const { recipeId } = useParams()
  const { recipe } = useSelector((state) => state.recipe)
  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const result = await getFullDetailsOfRecipe(recipeId, token)
      if (result?.recipeDetails) {
        dispatch(setEditRecipe(true))
        dispatch(setRecipe(result?.recipeDetails))
      }
      setLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="grid flex-1 place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        Edit Recipe
      </h1>
      <div className="mx-auto max-w-[600px]">
        {recipe ? (
          <RenderSteps />
        ) : (
          <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
            Recipe not found
          </p>
        )}
      </div>
    </div>
  )
}