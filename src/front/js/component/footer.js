import React from "react";
import { Link } from "react-router-dom";
import "../../styles/footer.css";

export const Footer = () => {
    return (
        <div className="footer">
            <div className="overlap">
                <div className="mafl">MAFL</div>
                <div className="text-wrapper">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                </div>
                <div className="menu">
                    <div>Home</div>
                    <div>Section One</div>
                    <div>Section Two</div>
                    <div>Section Three</div>
                </div>
            </div>
        </div>
    );
};
