import {combineReducers} from "@reduxjs/toolkit";

import authReducer from "../slices/authSlice"
import profileReducer from "../slices/profileSlice";
import cartReducer from "../slices/cartSlice"
import recipeReducer from "../slices/recipeSlice"
import viewRecipeReducer from "../slices/viewRecipeSlice"

const rootReducer  = combineReducers({
    auth: authReducer,
    profile:profileReducer,
    cart:cartReducer,
    recipe:recipeReducer,
    viewRecipe:viewRecipeReducer,
})

export default rootReducer