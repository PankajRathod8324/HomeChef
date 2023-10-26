const RatingAndReview = require("../models/RatingAndRaview");
const Recipe = require("../models/Recipe");
const mongoose = require("mongoose");

//createRating
exports.createRating = async (req, res) => {
    try{

        //get user id
        const userId = req.user.id;
        //fetchdata from req body
        const {rating, review, recipeId} = req.body;
        //check if user is enrolled or not
        const recipeDetails = await Recipe.findOne(
                                    {_id:recipeId,
                                    customersEnroled: {$elemMatch: {$eq: userId} },
                                });

        if(!recipeDetails) {
            return res.status(404).json({
                success:false,
                message:'Customer is not enrolled in the recipe',
            });
        }
        //check if user already reviewed the recipe
        const alreadyReviewed = await RatingAndReview.findOne({
                                                user:userId,
                                                recipe:recipeId,
                                            });
        if(alreadyReviewed) {
                    return res.status(403).json({
                        success:false,
                        message:'Recipe is already reviewed by the user',
                    });
                }
        //create rating and review
        const ratingReview = await RatingAndReview.create({
                                        rating, review, 
                                        recipe:recipeId,
                                        user:userId,
                                    });
       
        //update recipe with this rating/review
        const updatedRecipeDetails = await Recipe.findByIdAndUpdate({_id:recipeId},
                                    {
                                        $push: {
                                            ratingAndReviews: ratingReview._id,
                                        }
                                    },
                                    {new: true});
        console.log(updatedRecipeDetails);
        //return response
        return res.status(200).json({
            success:true,
            message:"Rating and Review created Successfully",
            ratingReview,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}



//getAverageRating
exports.getAverageRating = async (req, res) => {
    try {
            //get recipe ID
            const recipeId = req.body.recipeId;
            //calculate avg rating

            const result = await RatingAndReview.aggregate([
                {
                    $match:{
                        recipe: new mongoose.Types.ObjectId(recipeId),
                    },
                },
                {
                    $group:{
                        _id:null,
                        averageRating: { $avg: "$rating"},
                    }
                }
            ])

            //return rating
            if(result.length > 0) {

                return res.status(200).json({
                    success:true,
                    averageRating: result[0].averageRating,
                })

            }
            
            //if no rating/Review exist
            return res.status(200).json({
                success:true,
                message:'Average Rating is 0, no ratings given till now',
                averageRating:0,
            })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


//getAllRatingAndReviews

exports.getAllRating = async (req, res) => {
    try{
            const allReviews = await RatingAndReview.find({})
                                    .sort({rating: "desc"})
                                    .populate({
                                        path:"user",
                                        select:"firstName lastName email image",
                                    })
                                    .populate({
                                        path:"recipe",
                                        select: "recipeName",
                                    })
                                    .exec();
            return res.status(200).json({
                success:true,
                message:"All reviews fetched successfully",
                data:allReviews,
            });
    }   
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    } 
}