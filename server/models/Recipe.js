const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    recipeName: {
        type: String,
        required: true,
        trim: true,
    },
    // cuisine: {
    //     type: String,
    //     required: true,
    // },
    //dietaryPreferences: [String], // An array of strings (e.g., ["Vegetarian", "Gluten-Free"])
    //ingredients: [String], // An array of ingredient strings
    recipeDescription: {
        type: String,
    },
    cook: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    // instructions: {
    //     type: String,
    //     required: true,
    // },
    ingredients: {
        type:String,
    },
    recipeContent: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section",
        }
    ],
    //images: [String], // An array of image URLs
    //videos: [String], // An array of video URLs
    ratingAndReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReview",
        },
    ],
    price: {
        type:Number,
    },
    thumbnail: {
        type: String,
    },
    tag: {
		type: [String],
		required: true,
	},
    category: {
		type: mongoose.Schema.Types.ObjectId,
		// required: true,
		ref: "Category",
	},
    customersEnroled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
    ],
    instructions: {
		type: [String],
	},
	status: {
		type: String,
		enum: ["Draft", "Published"],
	},
    createdAt: {
		type:Date,
		default:Date.now
	},
});

// Export the Recipes model
module.exports = mongoose.model("Recipe", recipeSchema);
