const express = require("express")
const router = express.Router()
const { auth, isCook } = require("../middlewares/auth")
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledRecipes,
  cookDashboard,
} = require("../controllers/Profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile", auth,  deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
// Get Enrolled Recipes
router.get("/getEnrolledRecipes", auth, getEnrolledRecipes)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.get("/cookDashboard", auth, isCook, cookDashboard)

module.exports = router