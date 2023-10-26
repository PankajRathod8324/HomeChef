import { useSelector } from "react-redux"

import RenderCartRecipes from "./RenderCartRecipes"
import RenderTotalAmount from "./RenderTotalAmount"

export default function Cart() {
  const { total, totalItems } = useSelector((state) => state.cart)
  const { paymentLoading } = useSelector((state) => state.recipe)

  if (paymentLoading)
    return (
      <div className="flex h-screen items-center justify-center"  style={{ fontFamily: 'Cormorant Upright, sans-serif' }}>
        <div className="spinner"></div>
      </div>
    )

  return (
    <>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5"  style={{ fontFamily: 'Cormorant Upright, sans-serif' }}>Cart</h1>
      <p className="border-b border-b-richblack-400 pb-2 font-semibold text-richblack-400">
        {totalItems} Recipes in Cart
      </p>
      {total > 0 ? (
        <div className="mt-8 flex flex-col-reverse items-start gap-x-10 gap-y-6 lg:flex-row"  style={{ fontFamily: 'Cormorant Upright, sans-serif' }}>
          <RenderCartRecipes />
          <RenderTotalAmount />
        </div>
      ) : (
        <p className="mt-14 text-center text-3xl text-richblack-100"  style={{ fontFamily: 'Cormorant Upright, sans-serif' }}>
          Your cart is empty
        </p>
      )}
    </>
  )
}
