// Import the required modules
const express = require("express");
const router = express.Router();

// Import the Controllers

// Recipe Controllers Import
const {
  createRecipe,
  getAllRecipes,
  getRecipeDetails,
  getFullRecipeDetails,
  editRecipe,
  getCookRecipes,
  deleteRecipe,
} = require("../controllers/Recipe");



// Categories Controllers Import
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category");

// Sections Controllers Import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

// Sub-Sections Controllers Import
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection");

// Rating Controllers Import
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReview");
const {
  updateRecipeProgress,
  getProgressPercentage,
} = require("../controllers/recipeProgress");

// Importing Middlewares
const { auth, isCook, isCustomer, isAdmin } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Recipe routes
// ********************************************************************************************************
// Recipes can Only be Created by Cooks
router.post("/createRecipe", auth, isCook, createRecipe);
// Add a Section to a Recipe
router.post("/addSection", auth, isCook, createSection);
// Update a Section
router.post("/updateSection", auth, isCook, updateSection);
// Delete a Section
router.post("/deleteSection", auth, isCook, deleteSection);
// Edit Sub Section
router.post("/updateSubSection", auth, isCook, updateSubSection);
// Delete Sub Section
router.post("/deleteSubSection", auth, isCook, deleteSubSection);
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isCook, createSubSection);
// Get all Registered Recipes
router.get("/getAllRecipes", getAllRecipes);
// Get Details for a Specific Recipe
router.post("/getRecipeDetails", getRecipeDetails);
// Get Details for a Specific Recipes
router.post("/getFullRecipeDetails", auth, getFullRecipeDetails)
// Edit Recipe routes
router.post("/editRecipe", auth, isCook, editRecipe)
// Get all Recipes Under a Specific Cook
router.get("/getCookRecipes", auth, isCook, getCookRecipes)
// Delete a Recipe
router.delete("/deleteRecipe", deleteRecipe)

router.post("/updateRecipeProgress", auth, isCustomer, updateRecipeProgress);

// router.post("/getProgressPercentage", auth, isCustomer, getProgressPercentage);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isCustomer, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);

module.exports = router;
