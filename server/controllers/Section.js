const Section = require("../models/Section");
const Recipe = require("../models/Recipe");
const SubSection = require("../models/SubSection");
// CREATE a new section
exports.createSection = async (req, res) => {
	try {
		// Extract the required properties from the request body
		const { sectionName, recipeId } = req.body;

		// Validate the input
		if (!sectionName || !recipeId) {
			return res.status(400).json({
				success: false,
				message: "Missing required properties",
			});
		}

		// Create a new section with the given name
		const newSection = await Section.create({ sectionName });

		// Add the new section to the recipe's content array
		const updatedRecipe = await Recipe.findByIdAndUpdate(
			recipeId,
			{
				$push: {
					recipeContent: newSection._id,
				},
			},
			{ new: true }
		)
			.populate({
				path: "recipeContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();

		// Return the updated recipe object in the response
		res.status(200).json({
			success: true,
			message: "Section created successfully",
			updatedRecipe,
		});
	} catch (error) {
		// Handle errors
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};

// UPDATE a section
exports.updateSection = async (req, res) => {
	try {
		const { sectionName, sectionId,recipeId } = req.body;
		const section = await Section.findByIdAndUpdate(
			sectionId,
			{ sectionName },
			{ new: true }
		);

		const recipe = await Recipe.findById(recipeId)
		.populate({
			path:"recipeContent",
			populate:{
				path:"subSection",
			},
		})
		.exec();

		res.status(200).json({
			success: true,
			message: section,
			data:recipe,
		});
	} catch (error) {
		console.error("Error updating section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

// DELETE a section
exports.deleteSection = async (req, res) => {
	try {

		const { sectionId, recipeId }  = req.body;
		await Recipe.findByIdAndUpdate(recipeId, {
			$pull: {
				recipeContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		console.log(sectionId, recipeId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated recipe and return 
		const recipe = await Recipe.findById(recipeId).populate({
			path:"recipeContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();

		res.status(200).json({
			success:true,
			message:"Section deleted",
			data:recipe
		});
	} catch (error) {
		console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};   