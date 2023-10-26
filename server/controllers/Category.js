const { Mongoose } = require("mongoose");
const Category = require("../models/Category");
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

exports.createCategory = async (req, res) => {
	try {
		const { name, description } = req.body;
		if (!name) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}
		const CategorysDetails = await Category.create({
			name: name,
			description: description,
		});
		console.log(CategorysDetails);
		return res.status(200).json({
			success: true,
			message: "Categorys Created Successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: true,
			message: error.message,
		});
	}
};

exports.showAllCategories = async (req, res) => {
	try {
        console.log("INSIDE SHOW ALL CATEGORIES");
		const allCategorys = await Category.find({});
		res.status(200).json({
			success: true,
			data: allCategorys,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

//categoryPageDetails 

exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
      console.log("PRINTING CATEGORY ID: ", categoryId);
      // Get recipes for the specified category
      const selectedCategory = await Category.findById(categoryId)
        .populate({
          path: "recipes",
          match: { status: "Published" },
          populate: "ratingAndReviews",
        })
        .exec()
  
      //console.log("SELECTED RECIPE", selectedCategory)
      // Handle the case when the category is not found
      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
      // Handle the case when there are no recipes
      if (selectedCategory.recipes.length === 0) {
        console.log("No recipes found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No recipes found for the selected category.",
        })
      }
  
      // Get recipes for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
      let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
        .populate({
          path: "recipes",
          match: { status: "Published" },
        })
        .exec()
        //console.log("Different RECIPE", differentCategory)
      // Get top-selling recipes across all categories
      const allCategories = await Category.find()
        .populate({
          path: "recipes",
          match: { status: "Published" },
          populate: {
            path: "cook",
        },
        })
        .exec()
      const allRecipes = allCategories.flatMap((category) => category.recipes)
      const mostSellingRecipes = allRecipes
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
       // console.log("mostSellingRecipes RECIPE", mostSellingRecipes)
      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingRecipes,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }