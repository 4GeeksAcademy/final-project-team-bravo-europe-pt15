// BtnSignIn.jsx
import React from "react";
import "../../styles/navbar.css";

const BtnSignIn = ({ children }) => {
  return (
    <button className="btn">
      {children} {/* Display text content passed as children */}
    </button>
  );
};

export default BtnSignIn;
