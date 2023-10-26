const RecipeProgress = require("../models/RecipeProgress");
const SubSection = require("../models/SubSection");


exports.updateRecipeProgress = async(req,res) => {
    const {recipeId, subSectionId} = req.body;
    const userId = req.user.id;

    try{
        //check if the subsection is valid
        const subSection = await SubSection.findById(subSectionId);

        if(!subSection) {
            return res.status(404).json({error:"Invalid SUbSection"});
        }

        console.log("SubSection Validation Done");

        //check for old entry 
        let recipeProgress = await RecipeProgress.findOne({
            recipeID:recipeId,
            userId:userId,
        });
        if(!recipeProgress) {
            return res.status(404).json({
                success:false,
                message:"Recipe Progress does not exist"
            });
        }
        else {
            console.log("Recipe Progress Validation Done");
            //check for re-completing video/subsection
            if(recipeProgress.completedVideos.includes(subSectionId)) {
                return res.status(400).json({
                    error:"Subsection already completed",
                });
            }

            //poush into completed video
            recipeProgress.completedVideos.push(subSectionId);
            console.log("Copurse Progress Push Done");
        }
        await recipeProgress.save();
        console.log("Recipe Progress Save call Done");
        return res.status(200).json({
            success:true,
            message:"Recipe Progress Updated Successfully",
        })
    }
    catch(error) {
        console.error(error);
        return res.status(400).json({error:"Internal Server Error"});
    }
}