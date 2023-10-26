const mongoose = require("mongoose");

const recipeProgress = new mongoose.Schema({
    recipeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe", 
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    completedVideos: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SubSection",
        },
    ],
});

module.exports = mongoose.model("recipeProgress", recipeProgress);
