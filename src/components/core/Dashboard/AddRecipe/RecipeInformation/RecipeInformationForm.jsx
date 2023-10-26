import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import {
  addRecipeDetails,
  editRecipeDetails,
  fetchRecipeCategories,
} from "../../../../../services/operations/recipeDetailsAPI"
import { setRecipe, setStep } from "../../../../../slices/recipeSlice"
import { RECIPE_STATUS } from "../../../../../utils/constants"
import IconBtn from "../../../../common/IconBtn"
import Upload from "../Upload"
import ChipInput from "./ChipInput"
import RequirementsField from "./RequirementField"

export default function RecipeInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm()

  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { recipe, editRecipe } = useSelector((state) => state.recipe)
  const [loading, setLoading] = useState(false)
  const [recipeCategories, setRecipeCategories] = useState([])

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true)
      const categories = await fetchRecipeCategories()
      if (categories.length > 0) {
        // console.log("categories", categories)
        setRecipeCategories(categories)
      }
      setLoading(false)
    }
    // if form is in edit mode
    if (editRecipe) {
      // console.log("data populated", editRecipe)
      setValue("recipeTitle", recipe.recipeName)
      setValue("recipeShortDesc", recipe.recipeDescription)
      setValue("recipePrice", recipe.price)
      setValue("recipeTags", recipe.tag)
      setValue("recipeBenefits", recipe.ingredients)
      setValue("recipeCategory", recipe.category)
      setValue("recipeRequirements", recipe.instructions)
      setValue("recipeImage", recipe.thumbnail)
    }
    getCategories()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isFormUpdated = () => {
    const currentValues = getValues()
    // console.log("changes after editing form values:", currentValues)
    if (
      currentValues.recipeTitle !== recipe.recipeName ||
      currentValues.recipeShortDesc !== recipe.recipeDescription ||
      currentValues.recipePrice !== recipe.price ||
      currentValues.recipeTags.toString() !== recipe.tag.toString() ||
      currentValues.recipeBenefits !== recipe.ingredients ||
      currentValues.recipeCategory._id !== recipe.category._id ||
      currentValues.recipeRequirements.toString() !==
        recipe.instructions.toString() ||
      currentValues.recipeImage !== recipe.thumbnail
    ) {
      return true
    }
    return false
  }

  //   handle next button click
  const onSubmit = async (data) => {
    // console.log(data)

    if (editRecipe) {
      // const currentValues = getValues()
      // console.log("changes after editing form values:", currentValues)
      // console.log("now recipe:", recipe)
      // console.log("Has Form Changed:", isFormUpdated())
      if (isFormUpdated()) {
        const currentValues = getValues()
        const formData = new FormData()
        // console.log(data)
        formData.append("recipeId", recipe._id)
        if (currentValues.recipeTitle !== recipe.recipeName) {
          formData.append("recipeName", data.recipeTitle)
        }
        if (currentValues.recipeShortDesc !== recipe.recipeDescription) {
          formData.append("recipeDescription", data.recipeShortDesc)
        }
        if (currentValues.recipePrice !== recipe.price) {
          formData.append("price", data.recipePrice)
        }
        if (currentValues.recipeTags.toString() !== recipe.tag.toString()) {
          formData.append("tag", JSON.stringify(data.recipeTags))
        }
        if (currentValues.recipeBenefits !== recipe.ingredients) {
          formData.append("ingredients", data.recipeBenefits)
        }
        if (currentValues.recipeCategory._id !== recipe.category._id) {
          formData.append("category", data.recipeCategory)
        }
        if (
          currentValues.recipeRequirements.toString() !==
          recipe.instructions.toString()
        ) {
          formData.append(
            "instructions",
            JSON.stringify(data.recipeRequirements)
          )
        }
        if (currentValues.recipeImage !== recipe.thumbnail) {
          formData.append("thumbnailImage", data.recipeImage)
        }
        // console.log("Edit Form data: ", formData)
        setLoading(true)
        const result = await editRecipeDetails(formData, token)
        setLoading(false)
        if (result) {
          dispatch(setStep(2))
          dispatch(setRecipe(result))
        }
      } else {
        toast.error("No changes made to the form")
      }
      return
    }

    const formData = new FormData()
    formData.append("recipeName", data.recipeTitle)
    formData.append("recipeDescription", data.recipeShortDesc)
    formData.append("price", data.recipePrice)
    formData.append("tag", JSON.stringify(data.recipeTags))
    formData.append("ingredients", data.recipeBenefits)
    formData.append("category", data.recipeCategory)
    formData.append("status", RECIPE_STATUS.DRAFT)
    formData.append("instructions", JSON.stringify(data.recipeRequirements))
    formData.append("thumbnailImage", data.recipeImage)
    setLoading(true)
    const result = await addRecipeDetails(formData, token)
    if (result) {
      dispatch(setStep(2))
      dispatch(setRecipe(result))
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
      {/* Recipe Title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="recipeTitle">
          Recipe Title <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="recipeTitle"
          placeholder="Enter Recipe Title"
          {...register("recipeTitle", { required: true })}
          className="form-style w-full"
        />
        {errors.recipeTitle && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Recipe title is required
          </span>
        )}
      </div>
      {/* Recipe Short Description */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="recipeShortDesc">
          Recipe Short Description <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="recipeShortDesc"
          placeholder="Enter Description"
          {...register("recipeShortDesc", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.recipeShortDesc && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Recipe Description is required
          </span>
        )}
      </div>
      {/* Recipe Price */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="recipePrice">
          Recipe Price <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="recipePrice"
            placeholder="Enter Recipe Price"
            {...register("recipePrice", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="form-style w-full !pl-12"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
        {errors.recipePrice && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Recipe Price is required
          </span>
        )}
      </div>
      {/* Recipe Category */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="recipeCategory">
          Recipe Category <sup className="text-pink-200">*</sup>
        </label>
        <select
          {...register("recipeCategory", { required: true })}
          defaultValue=""
          id="recipeCategory"
          className="form-style w-full"
        >
          <option value="" disabled>
            Choose a Category
          </option>
          {!loading &&
            recipeCategories?.map((category, indx) => (
              <option key={indx} value={category?._id}>
                {category?.name}
              </option>
            ))}
        </select>
        {errors.recipeCategory && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Recipe Category is required
          </span>
        )}
      </div>
      {/* Recipe Tags */}
      <ChipInput
        label="Tags"
        name="recipeTags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />
      {/* Recipe Thumbnail Image */}
      <Upload
        name="recipeImage"
        label="Recipe Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editRecipe ? recipe?.thumbnail : null}
      />
      {/* Benefits of the recipe */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="recipeBenefits">
          Benefits of the recipe <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="recipeBenefits"
          placeholder="Enter benefits of the recipe"
          {...register("recipeBenefits", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.recipeBenefits && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Benefits of the recipe is required
          </span>
        )}
      </div>
      {/* Requirements/Instructions */}
      <RequirementsField
        name="recipeRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />
      {/* Next Button */}
      <div className="flex justify-end gap-x-2">
        {editRecipe && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
          >
            Continue Wihout Saving
          </button>
        )}
        <IconBtn
          disabled={loading}
          text={!editRecipe ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  )
}