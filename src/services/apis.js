const BASE_URL = process.env.REACT_APP_BASE_URL

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
}

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_RECIPES_API: BASE_URL + "/profile/getEnrolledRecipes",
  GET_COOK_DATA_API: BASE_URL + "/profile/cookDashboard",
}

// CUSTOMERS ENDPOINTS
export const customerEndpoints = {
  RECIPE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  RECIPE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
}

// RECIPE ENDPOINTS
export const recipeEndpoints = {
  GET_ALL_RECIPE_API: BASE_URL + "/recipe/getAllRecipes",
  RECIPE_DETAILS_API: BASE_URL + "/recipe/getRecipeDetails",
  EDIT_RECIPE_API: BASE_URL + "/recipe/editRecipe",
  RECIPE_CATEGORIES_API: BASE_URL + "/recipe/showAllCategories",
  CREATE_RECIPE_API: BASE_URL + "/recipe/createRecipe",
  CREATE_SECTION_API: BASE_URL + "/recipe/addSection",
  CREATE_SUBSECTION_API: BASE_URL + "/recipe/addSubSection",
  UPDATE_SECTION_API: BASE_URL + "/recipe/updateSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/recipe/updateSubSection",
  GET_ALL_COOK_RECIPES_API: BASE_URL + "/recipe/getCookRecipes",
  DELETE_SECTION_API: BASE_URL + "/recipe/deleteSection",
  DELETE_SUBSECTION_API: BASE_URL + "/recipe/deleteSubSection",
  DELETE_RECIPE_API: BASE_URL + "/recipe/deleteRecipe",
  GET_FULL_RECIPE_DETAILS_AUTHENTICATED:
    BASE_URL + "/recipe/getFullRecipeDetails",
  LECTURE_COMPLETION_API: BASE_URL + "/recipe/updateRecipeProgress",
  CREATE_RATING_API: BASE_URL + "/recipe/createRating",
}

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/recipe/getReviews",
}

// CATAGORIES API
export const categories = {
  CATEGORIES_API: BASE_URL + "/recipe/showAllCategories",
}

// MENU PAGE DATA
export const menuData = {
  MENUPAGEDATA_API: BASE_URL + "/recipe/getCategoryPageDetails",
}
// CONTACT-US API
export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/reach/contact",
}

// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
}
// recipe