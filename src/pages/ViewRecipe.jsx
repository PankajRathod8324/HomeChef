import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { getFullDetailsOfRecipe } from '../services/operations/recipeDetailsAPI';
import { setCompletedLectures, setRecipeSectionData, setEntireRecipeData, setTotalNoOfLectures } from '../slices/viewRecipeSlice';
import VideoDetailsSidebar from '../components/core/ViewRecipe/VideoDetailsSidebar';
import RecipeReviewModal from '../components/core/ViewRecipe/RecipeReviewModal';

export default function ViewRecipe(){

    const [reviewModal, setReviewModal] = useState(false);
    const {recipeId} = useParams();
    const {token} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
      ;(async () => {
        const recipeData = await getFullDetailsOfRecipe(recipeId, token)
        // console.log("Recipe Data here... ", recipeData.recipeDetails)
        dispatch(setRecipeSectionData(recipeData.recipeDetails.recipeContent))
        dispatch(setEntireRecipeData(recipeData.recipeDetails))
        dispatch(setCompletedLectures(recipeData.completedVideos))
        let lectures = 0
        recipeData?.recipeDetails?.recipeContent?.forEach((sec) => {
          lectures += sec.subSection.length
        })
        dispatch(setTotalNoOfLectures(lectures))
      })()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)]"  style={{ fontFamily: 'Cormorant Upright, sans-serif' }}>
        <VideoDetailsSidebar setReviewModal={setReviewModal} />
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <div className="mx-6">
            <Outlet />
          </div>
        </div>
      </div>
      {reviewModal && (<RecipeReviewModal setReviewModal={setReviewModal} />)}        
    </>
  )
}


