import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  recipeSectionData: [],
  recipeEntireData: [],
  completedLectures: [],
  totalNoOfLectures: 0,
};

const viewRecipeSlice = createSlice({
  name: "viewRecipe", // Changed from "viewRecipe" to "viewRecipe"
  initialState,
  reducers: {
    setRecipeSectionData: (state, action) => {
      state.recipeSectionData = action.payload; // Changed from "recipeSectionData" to "recipeSectionData"
    },
    setEntireRecipeData: (state, action) => {
      state.recipeEntireData = action.payload; // Changed from "recipeEntireData" to "recipeEntireData"
    },
    setTotalNoOfLectures: (state, action) => {
      state.totalNoOfLectures = action.payload
    },
    setCompletedLectures: (state, action) => {
      state.completedLectures = action.payload
    },
    updateCompletedLectures: (state, action) => {
      state.completedLectures = [...state.completedLectures, action.payload]
    },
  },
});

export const {
  setRecipeSectionData,
  setEntireRecipeData,
  setTotalNoOfLectures,
  setCompletedLectures,
  updateCompletedLectures,
} = viewRecipeSlice.actions;

export default viewRecipeSlice.reducer;
