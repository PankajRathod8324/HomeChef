import React from "react";
import HighlightText from "../../../components/core/HomePage/HighlightText";
import CTAButton from "../../../components/core/HomePage/Button";

const RecipeGridArray = [
  {
    order: -1,
    heading: "Discover Delicious Recipes for",
    highlightText: "Every Palate",
    description:
      "HomeChef partners with top chefs and home cooks to bring you a diverse collection of mouthwatering recipes for every taste and occasion.",
    BtnText: "Explore Recipes",
    BtnLink: "/recipes",
  },
  {
    order: 1,
    heading: "User-Friendly Cooking Instructions",
    description:
      "Save time and enjoy hassle-free cooking! Our recipe instructions are designed to be easy to follow, making your culinary journey a breeze.",
  },
  {
    order: 2,
    heading: "Variety of Cuisines",
    description:
      "Explore a world of flavors! Our app offers a wide range of cuisines, from Italian pasta to spicy Thai dishes.",
  },
  {
    order: 3,
    heading: "Cooking Tips and Techniques",
    description:
      "Enhance your culinary skills! Learn valuable cooking tips and techniques from expert chefs right within the app.",
  },
];

const RecipeGrid = () => {
  return (
    <div className="grid mx-auto w-[350px] xl:w-fit grid-cols-1 xl:grid-cols-2 xl:grid-rows-2 gap-8 mb-12">
      {RecipeGridArray.map((card, i) => {
        return (
          <div
            key={i}
            className={`${i === 0 && "xl:col-span-2 xl:row-span-2"} ${
              card.order % 2 === 1
                ? "bg-richblack-700"
                : card.order % 2 === 0
                ? "bg-richblack-800"
                : "bg-transparent"
            }`}
          >
            {card.order < 0 ? (
              <div className="p-8 xl:p-10 flex flex-col gap-3">
                <div className="text-4xl font-semibold text-white">
                  {card.heading}
                  <HighlightText text={card.highlightText} />
                </div>
                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>

                <div className="w-fit mt-2">
                  <CTAButton active={true} linkto={card.BtnLink}>
                    {card.BtnText}
                  </CTAButton>
                </div>
              </div>
            ) : (
              <div className="p-8 flex flex-col gap-8">
                <h1 className="text-richblack-500 text-lg">{card.heading}</h1>

                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RecipeGrid;
