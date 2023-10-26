import React from "react";
import SubHeading from "../SubHeading/SubHeading";
import "./Newsletter.css";

const Newsletter = () => {
  // Function to handle the button click and redirect to the desired URL
  const redirectToSignUp = () => {
    window.location.href = "http://localhost:3000/signup";
  };

  return (
    <div className="app__newsletter">
      <div className="app__newsletter-heading">
        <SubHeading title="Newsletter" />
        <h1 className="headtext__cormorant">Subscribe To Our Newsletter</h1>
        <p className="p__opensans">And never miss latest Updates!</p>
      </div>
      <div className="app__newsletter-input flex__center">
        <input type="email" placeholder="Enter your email address" />
        <button
          type="button"
          className="custom__button"
          onClick={redirectToSignUp}
        >
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default Newsletter;
