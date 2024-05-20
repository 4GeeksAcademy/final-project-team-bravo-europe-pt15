import React from "react";
import "../../styles/herosection.css";
import { useNavigate } from "react-router-dom";

export const Box = () => {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate("/signup");
  };

  return (
    <div className="box">
      <div className="HERO-SECTION">
        <div className="overlap-group">
          <div className="ellipse" />
          <p className="USING-AI-HAS-NEVER">
            USING AI HAS <br />
            NEVER BEEN THAT EASY
          </p>
          <p className="text-wrapper">
            Editing, transcribing, and formatting texts and photos were never
            that easy!
          </p>
          <div className="btn">
            <button
              className="frame"
              id="prostyling"
              onClick={handleSignInClick}
            >
              Sign up Now
            </button>
          </div>
          <div className="ellipse-2" />
        </div>
        <div className="ellipse-3" />
        <div className="ellipse-4" />
      </div>
    </div>
  );
};
