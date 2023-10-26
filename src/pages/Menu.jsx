import React, { useEffect, useState } from 'react'
import Footer from '../components/container/Footer/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getMenuPageData } from '../services/operations/pageAndComponentData';
import Recipe_Card from '../components/core/Menu/Recipe_Card';
import { useSelector } from "react-redux"
import Error from "./Error"
import RecipeSlider from '../components/core/Menu/RecipeSlider';
import ReviewSlider from "../components/common/ReviewSlider"

const Menu = () => {

  const { loading } = useSelector((state) => state.profile)
  const { menuName } = useParams()
  const [active, setActive] = useState(1)
  const [menuPageData, setMenuPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");

  //Fetch all categories
  useEffect(() => {
    ;(async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        const category_id = res?.data?.data?.filter(
          (ct) => ct.name.split(" ").join("-").toLowerCase() === menuName
        )[0]._id
        setCategoryId(category_id)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
    })()
  }, [menuName])

  useEffect(() => {
    if (categoryId) {
      ;(async () => {
        try {
          const res = await getMenuPageData(categoryId)
          setMenuPageData(res)
        } catch (error) {
          console.log(error)
        }
      })()
    }
  }, [categoryId])


  if (loading || !menuPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }
  if (!loading && !menuPageData.success) {
    return <Error />
  }

  return (
    <>
      {/* Hero Section */}
      <div className=" box-content bg-richblack-800 px-4" style={{ fontFamily: 'Cormorant Upright, sans-serif' }}>
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
          <p className="text-sm text-richblack-300">
            {`Home / Menu / `}
            <span className="text-yellow-25">
              {menuPageData?.data?.selectedCategory?.name}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {menuPageData?.data?.selectedCategory?.name}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {menuPageData?.data?.selectedCategory?.description}
          </p>
        </div>
      </div>

      {/* Section 1 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent" style={{ fontFamily: 'Cormorant Upright, sans-serif' }}>
        <div className="section_heading">Recipes to get you started</div>
        <div className="my-4 flex border-b border-b-richblack-600 text-sm">
          <p
            className={`px-4 py-2 ${active === 1
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
              } cursor-pointer`}
            onClick={() => setActive(1)}
          >
            Most Populer
          </p>
          <p
            className={`px-4 py-2 ${active === 2
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
              } cursor-pointer`}
            onClick={() => setActive(2)}
          >
            New
          </p>
        </div>
        <div>
          <RecipeSlider
            Recipes={menuPageData?.data?.selectedCategory?.recipes}
          />
        </div>
      </div>
      {/* Section 2 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent" style={{ fontFamily: 'Cormorant Upright, sans-serif' }}>
        <div className="section_heading">
          Top recipes in {menuPageData?.data?.differentCategory?.name}
        </div>
        <div className="py-8">
          <RecipeSlider
            Recipes={menuPageData?.data?.differentCategory?.recipes}
          />
        </div>
      </div>

      {/* Section 3 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent" style={{ fontFamily: 'Cormorant Upright, sans-serif' }}>
        <div className="section_heading">Frequently Bought</div>
        <div className="py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {menuPageData?.data?.mostSellingRecipes
              ?.slice(0, 4)
              .map((recipe, i) => (
                <Recipe_Card recipe={recipe} key={i} Height={"h-[400px]"} />
              ))}
          </div>
        </div>
      </div>
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white"  style={{ fontFamily: 'Cormorant Upright, sans-serif' }}>
        {/* Reviws from Other Learner */}
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other Customers
        </h1>
        <ReviewSlider />
      </div>
      <Footer />
    </>
  )
}

export default Menu