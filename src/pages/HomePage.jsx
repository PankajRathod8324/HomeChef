import React from "react";
import ReviewSlider from "../components/common/ReviewSlider"

import {
  AboutUs,
  Chef,
  FindUs,
  Footer,
  Gallery,
  Header,
  Intro,
  Laurels,
  SpecialMenu,
} from "../components/container";
import "../../src/Home.css";

const HomePage = () => (
  <div>
    <Header />
    <AboutUs />
    <SpecialMenu />
    <Chef />
    <Intro />
    <Laurels />
    <Gallery />
    <FindUs />
    <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white"  style={{ fontFamily: 'Cormorant Upright, sans-serif' }}>
        {/* Reviws from Other Learner */}
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other Customers
        </h1>
        <ReviewSlider />
    </div>
    <Footer />
  </div>
);

export default HomePage;
