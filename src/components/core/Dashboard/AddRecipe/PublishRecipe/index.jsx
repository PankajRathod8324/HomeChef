import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { editRecipeDetails } from "../../../../../services/operations/recipeDetailsAPI";
import { resetRecipeState, setStep } from "../../../../../slices/recipeSlice";
import { RECIPE_STATUS } from "../../../../../utils/constants";
import IconBtn from "../../../../common/IconBtn";

export default function PublishRecipe() {
  const { register, handleSubmit, setValue, getValues } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { recipe } = useSelector((state) => state.recipe);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ensure that recipe is available before trying to access it
    if (recipe && recipe.status === RECIPE_STATUS.PUBLISHED) {
      setValue("public", true);
    }
  }, [recipe]); // Add [recipe] as a dependency to the useEffect

  const goBack = () => {
    dispatch(setStep(2));
  }

  const goToRecipes = () => {
    dispatch(resetRecipeState());
    navigate("/dashboard/my-recipes");
  }

  const handleRecipePublish = async () => {
    // check if form has been updated or not
    if (
      (recipe?.status === RECIPE_STATUS.PUBLISHED &&
        getValues("public") === true) ||
      (recipe?.status === RECIPE_STATUS.DRAFT && getValues("public") === false)
    ) {
      // form has not been updated
      // no need to make API call
      goToRecipes();
      return;
    }
    const formData = new FormData();
    formData.append("recipeId", recipe._id);
    const recipeStatus = getValues("public")
      ? RECIPE_STATUS.PUBLISHED
      : RECIPE_STATUS.DRAFT;
    formData.append("status", recipeStatus);
    setLoading(true);
    const result = await editRecipeDetails(formData, token);
    if (result) {
      goToRecipes();
    }
    setLoading(false);
  }

  const onSubmit = (data) => {
    handleRecipePublish();
  }

  return (
    <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"  style={{ fontFamily: 'Cormorant Upright, sans-serif' }}>
      <p className="text-2xl font-semibold text-richblack-5">
        Publish Settings
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Checkbox */}
        <div className="my-6 mb-8">
          <label htmlFor="public" className="inline-flex items-center text-lg">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
            />
            <span className="ml-2 text-richblack-400">
              Make this recipe as public
            </span>
          </label>
        </div>

        {/* Next Prev Button */}
        <div className="ml-auto flex max-w-max items-center gap-x-4">
          <button
            disabled={loading}
            type="button"
            onClick={goBack}
            className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
          >
            Back
          </button>
          <IconBtn disabled={loading} text="Save Changes" />
        </div>
      </form>
    </div>
  );
}
