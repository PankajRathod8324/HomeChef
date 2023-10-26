import React from 'react'

import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { FreeMode, Pagination}  from 'swiper'

import Recipe_Card from './Recipe_Card'

const RecipeSlider = ({Recipes}) => {
  return (
    <>
      {Recipes?.length ? (
        <Swiper
          slidesPerView={1}
          spaceBetween={25}
          loop={true}
          modules={[FreeMode, Pagination]}
          breakpoints={{
            1024: {
              slidesPerView: 3,
            },
          }}
          className="max-h-[30rem]"
        >
          {Recipes?.map((recipe, i) => (
            <SwiperSlide key={i}>
              <Recipe_Card recipe={recipe} Height={"h-[250px]"} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-xl text-richblack-5">No Recipe Found</p>
      )}
    </>
  )
}

export default RecipeSlider
