import React, { useEffect, useState } from 'react'
// Icons
import { FaRegStar, FaStar } from "react-icons/fa"
import ReactStars from "react-rating-stars-component"

import RatingStars from '../../common/RatingStars'
import GetAvgRating from '../../../utils/avgRating';
import { Link } from 'react-router-dom';

const Recipe_Card = ({ recipe, Height }) => {


  const [avgReviewCount, setAvgReviewCount] = useState(0);
  useEffect(() => {
    const count = GetAvgRating(recipe.ratingAndReviews);
    setAvgReviewCount(count);
  }, [recipe])



  return (
    <>
      <Link to={`/recipes/${recipe._id}`}>
        <div className="">
          <div className="rounded-lg">
            <img
              src={recipe?.thumbnail}
              alt="recipe thumnail"
              className={`${Height} w-full rounded-xl object-cover `}
            />
          </div>
          <div className="flex flex-col gap-2 px-1 py-3">
            <p className="text-xl text-richblack-5">{recipe?.recipeName}</p>
            <p className="text-sm text-richblack-50">
              {recipe?.cook?.firstName} {recipe?.cook?.lastName}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-yellow-5">{avgReviewCount || 0}</span>
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-richblack-400">
                {recipe?.ratingAndReviews?.length} Ratings
              </span>
            </div>
            <p className="text-xl text-richblack-5">Rs. {recipe?.price}</p>
          </div>
        </div>
      </Link>
    </>
  )
}

export default Recipe_Card
