import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchCookRecipes } from '../../../services/operations/recipeDetailsAPI';
import { getCookData } from '../../../services/operations/profileAPI';
import CookChart from './CookDashboard/CookChart';
import { Link } from 'react-router-dom';

export default function Cook() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);
  const [cookData, setCookData] = useState(null);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    ;(async () => {
      setLoading(true);
      const cookApiData = await getCookData(token);
      const result = await fetchCookRecipes(token);
      console.log(cookApiData);
      if (cookApiData?.length) setCookData(cookApiData);
      if (result) {
        setRecipes(result);
      }
      setLoading(false);
    })();
  }, []);

  const totalAmount = cookData?.reduce(
    (acc, curr) => acc + curr.totalAmountGenerated,
    0
  );

  const totalCustomers = cookData?.reduce(
    (acc, curr) => acc + curr.totalCustomersEnrolled,
    0
  );

  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-richblack-5">
          Hi {user?.firstName} 👋
        </h1>
        <p className="font-medium text-richblack-200">
          Let's start something new
        </p>
      </div>
      {loading ? (
        <div className="spinner"></div>
      ) : recipes.length > 0 ? (
        <div>
          <div className="my-4 flex h-[450px] space-x-4">
            {/* Render chart / graph */}
            {totalAmount > 0 || totalCustomers > 0 ? (
              <CookChart recipes={cookData} />
            ) : (
              <div className="flex-1 rounded-md bg-richblack-800 p-6">
                <p className="text-lg font-bold text-richblack-5">Visualize</p>
                <p className="mt-4 text-xl font-medium text-richblack-50">
                  Not Enough Data To Visualize
                </p>
              </div>
            )}
            {/* Total Statistics */}
            <div className="flex min-w-[250px] flex-col rounded-md bg-richblack-800 p-6">
              <p className="text-lg font-bold text-richblack-5">Statistics</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-lg text-richblack-200">Total Recipes</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    {recipes.length}
                  </p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">Total Customers</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    {totalCustomers}
                  </p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">Total Income</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    Rs. {totalAmount}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-md bg-richblack-800 p-6">
            {/* Render 3 recipes */}
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-richblack-5">Your Recipes</p>
              <Link to="/dashboard/my-recipes">
                <p className="text-xs font-semibold text-yellow-50">View All</p>
              </Link>
            </div>
            <div className="my-4 flex items-start space-x-6">
              {recipes.slice(0, 3).map((recipe) => (
                <div key={recipe._id} className="w-1/3">
                  <img
                    src={recipe.thumbnail}
                    alt={recipe.recipeName}
                    className="h-[201px] w-full rounded-md object-cover"
                  />
                  <div className="mt-3 w-full">
                    <p className="text-sm font-medium text-richblack-50">
                      {recipe.recipeName}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      <p className="text-xs font-medium text-richblack-300">
                        {recipe.customersEnroled?.length} customers
                      </p>
                      <p className="text-xs font-medium text-richblack-300">
                        |
                      </p>
                      <p className="text-xs font-medium text-richblack-300">
                        Rs. {recipe.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
          <p className="text-center text-2xl font-bold text-richblack-5">
            You have not created any recipes yet
          </p>
          <Link to="/dashboard/add-recipe">
            <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
              Create a recipe
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}
