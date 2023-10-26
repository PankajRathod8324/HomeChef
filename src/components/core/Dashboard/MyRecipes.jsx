import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { fetchCookRecipes } from "../../../services/operations/recipeDetailsAPI"
import IconBtn from "../../common/IconBtn"
import RecipesTable from "./CookRecipes/RecipesTable"

export default function MyRecipes() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState([])

  useEffect(() => {
    const fetchRecipes = async () => {
      const result = await fetchCookRecipes(token)
      if (result) {
        setRecipes(result)
      }
    }
    fetchRecipes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">My Recipes</h1>
        <IconBtn
          text="Add Recipe"
          onclick={() => navigate("/dashboard/add-recipe")}
        >
          <VscAdd />
        </IconBtn>
      </div>
      {recipes && <RecipesTable recipes={recipes} setRecipes={setRecipes} />}
    </div>
  )
}