import { useEffect } from "react"
import "./App.css"
// Redux
import { useDispatch, useSelector } from "react-redux"
// React Router
import { Route, Routes, useNavigate } from "react-router-dom"

// Components
import Navbar from "./components/common/Navbar"
import OpenRoute from "./components/core/Auth/OpenRoute"
import PrivateRoute from "./components/core/Auth/PrivateRoute"
import AddRecipe from "./components/core/Dashboard/AddRecipe"
import Cart from "./components/core/Dashboard/Cart"
import EditRecipe from "./components/core/Dashboard/EditRecipe"
import EnrolledRecipes from "./components/core/Dashboard/EnrolledRecipes"
import Cook from "./components/core/Dashboard/Cook"
import MyRecipes from "./components/core/Dashboard/MyRecipes"
import MyProfile from "./components/core/Dashboard/MyProfile"
import Settings from "./components/core/Dashboard/Settings"
import VideoDetails from "./components/core/ViewRecipe/VideoDetails"
import About from "./pages/About"
import Menu from "./pages/Menu"
import Contact from "./pages/Contact"
import RecipeDetails from "./pages/RecipeDetails"
import Dashboard from "./pages/Dashboard"
import Error from "./pages/Error"
import ForgotPassword from "./pages/ForgotPassword"
// Pages
// import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import UpdatePassword from "./pages/UpdatePassword"
import VerifyEmail from "./pages/VerifyEmail"
import ViewRecipe from "./pages/ViewRecipe"
import { getUserDetails } from "./services/operations/profileAPI"
import { ACCOUNT_TYPE } from "./utils/constants"
import HomePage from "./pages/HomePage"

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.profile)

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = JSON.parse(localStorage.getItem("token"))
      dispatch(getUserDetails(token, navigate))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter"  style={{ fontFamily: 'Cormorant Upright, sans-serif' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="recipes/:recipeId" element={<RecipeDetails />} />
        <Route path="menu/:menuName" element={<Menu />} />
        {/* Open Route - for Only Non Logged in User */}
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
        {/* Private Route - for Only Logged in User */}
        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          {/* Route for all users */}
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/Settings" element={<Settings />} />
          {/* Route only for Cooks */}
          {user?.accountType === ACCOUNT_TYPE.COOK && (
            <>
              <Route path="dashboard/cook" element={<Cook />} />
              <Route path="dashboard/my-recipes" element={<MyRecipes />} />
              <Route path="dashboard/add-recipe" element={<AddRecipe />} />
              <Route
                path="dashboard/edit-recipe/:recipeId"
                element={<EditRecipe />}
              />
            </>
          )}
          {/* Route only for Customers */}
          {user?.accountType === ACCOUNT_TYPE.CUSTOMER && (
            <>
              <Route
                path="dashboard/enrolled-recipes"
                element={<EnrolledRecipes />}
              />
              <Route path="/dashboard/cart" element={<Cart />} />
            </>
          )}
          <Route path="dashboard/settings" element={<Settings />} />
        </Route>

        {/* For the watching recipe lectures */}
        <Route
          element={
            <PrivateRoute>
              <ViewRecipe />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.CUSTOMER && (
            <>
              <Route
                path="view-recipe/:recipeId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  )
}

export default App
