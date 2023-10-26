import React from "react";
import loginImg from "../assets/Images/login.webp";
import Template from "../components/core/Auth/Template";

function Login() {
  return (
    <Template
  
      title="Welcome to Our Recipe App"
      description1="Discover Exquisite Flavors, Elevate Your Cooking,"
      description2="and Savor Every Bite."
      image={loginImg}
      formType="login"
    />
  );
}

export default Login;
