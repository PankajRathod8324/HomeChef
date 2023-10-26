import React from "react";
import { images } from "../../../constants";
import "./AboutUs.css";

const AboutUs = () => {
  // Function to handle the button click and redirect to the desired URL
  const redirectToSignUp = () => {
    window.location.href = "http://localhost:3000/signup";
  };

  return (
    <div
      className="app__aboutus app__bg flex__center section__padding text-white"
      id="about"
    >
      <div className="app__aboutus-overlay flex__center">
        <img src={images.G} alt="G_overlay" />
      </div>

      <div className="app__aboutus-content flex__center">
        <div className="app__aboutus-content_about">
          <h1 className="headtext__cormorant">About Us</h1>
          <img src={images.spoon} alt="about_spoon" className="spoon__img" />
          <p className="p__opensans">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis pharetra
            adipiscing ultrices vulputate posuere tristique. In sed odio nec
            aliquet eu proin mauris et.
          </p>
          <button type="button" className="custom__button" onClick={redirectToSignUp}>
            Know More
          </button>
        </div>

        <div className="app__aboutus-content_knife flex__center">
          <img src={images.knife} alt="about_knife" />
        </div>

        <div className="app__aboutus-content_history">
          <h1 className="headtext__cormorant">Our History</h1>
          <img src={images.spoon} alt="about_spoon" className="spoon__img" />
          <p className="p__opensans">
            Adipiscing tempus ullamcorper lobortis odio tellus arcu volutpat.
            Risus placerat morbi volutpat habitasse interdum mi aliquam In sed
            odio nec aliquet.
          </p>
          <button type="button" className="custom__button" onClick={redirectToSignUp}>
            Know More
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
