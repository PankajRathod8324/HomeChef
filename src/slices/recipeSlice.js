import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  step: 1,
  recipe: null,
  editRecipe: false,
  paymentLoading: false,
}

const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload
    },
    setRecipe: (state, action) => {
      state.recipe = action.payload
    },
    setEditRecipe: (state, action) => {
      state.editRecipe = action.payload
    },
    setPaymentLoading: (state, action) => {
      state.paymentLoading = action.payload
    },
    resetRecipeState: (state) => {
      state.step = 1
      state.recipe = null
      state.editRecipe = false
    },
  },
})

export const {
  setStep,
  setRecipe,
  setEditRecipe,
  setPaymentLoading,
  resetRecipeState,
} = recipeSlice.actions

export default recipeSlice.reducer