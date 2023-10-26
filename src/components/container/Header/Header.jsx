import React from "react";
import { SubHeading } from "../../components";
import { images } from "../../../constants";
import "./Header.css";

const Header = () => {
  // Function to handle the button click and redirect to the desired URL
  const redirectToSignUp = () => {
    window.location.href = "http://localhost:3000/signup";
  };

  return (
    <div className="app__header app__wrapper section__padding text-white" id="home">
      <div className="app__wrapper_info">
        <SubHeading title="Chase the new flavor" />
        <h1 className="app__header-h1">The Key To Fine Dining</h1>
        <p className="p__opensans" style={{ margin: "2rem 0" }}>
          Discover Exquisite Flavors, Elevate Your Cooking, and Savor Every Bite. Indulge in Culinary Excellence with Our Handpicked Recipes
        </p>
        <button type="button" className="custom__button" onClick={redirectToSignUp}>
          Explore Menu
        </button>
      </div>

      <div className="app__wrapper_img">
        <img src={images.welcome} alt="header_img" />
      </div>
    </div>
  );
};

export default Header;
