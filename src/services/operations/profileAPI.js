import { toast } from "react-hot-toast"

import { setLoading, setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector"
import { logout } from "./authAPI"

import { profileEndpoints } from "../apis";
const { GET_USER_DETAILS_API, GET_USER_ENROLLED_RECIPES_API, GET_COOK_DATA_API } = profileEndpoints;


export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      })
      console.log("GET_USER_DETAILS API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      const userImage = response.data.data.image
        ? response.data.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`
      dispatch(setUser({ ...response.data.data, image: userImage }))
    } catch (error) {
      dispatch(logout(navigate))
      console.log("GET_USER_DETAILS API ERROR............", error)
      toast.error("Could Not Get User Details")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

export async function getUserEnrolledRecipes(token) {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    console.log("BEFORE Calling BACKEND API FOR ENROLLED RECIPES");
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_RECIPES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("AFTER Calling BACKEND API FOR ENROLLED RECIPES");
    console.log(
      "GET_USER_ENROLLED_RECIPES_API API RESPONSE............",
      response
    )

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data.data
  } catch (error) {
    console.log("GET_USER_ENROLLED_RECIPES_API API ERROR............", error)
    toast.error("Could Not Get Enrolled Recipes")
  }
  toast.dismiss(toastId)
  return result
}


export async function getCookData(token) {
  const toastId = toast.loading("Loading...");
  let result = [];
  try{
    const response = await apiConnector("GET", GET_COOK_DATA_API, null, 
    {
      Authorization: `Bearer ${token}`,
    })

    console.log("GET_COOK_API_RESPONSE", response);
    result = response?.data?.recipes

  }
  catch(error) {
    console.log("GET_COOK_API ERROR", error);
    toast.error("Could not Get COOK Data")
  }
  toast.dismiss(toastId);
  return result;
}