import React from "react";
import signupImg from "../assets/Images/signup.webp";
import Template from "../components/core/Auth/Template";

function Signup() {
  return (
    <Template
      title="Join Our Recipe Community"
      description1="Explore delicious recipes and share your culinary creations with others."
      description2="Sign up today to start your culinary journey."
      image={signupImg}
      formType="signup"
    />
  );
}

export default Signup;
