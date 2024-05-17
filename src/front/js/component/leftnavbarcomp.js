import React from "react";
import "../../styles/leftnavbar.css";

const LeftNavbar = () => {
  return (
    <nav className="left-navbar">
      <ul className="nav-menu sticky-top">
        <li className="nav-item">
          <button className="nav-btn">Background Removal</button>
        </li>
        <li className="nav-item">
          <button className="nav-btn">Generative Restore</button>
        </li>
        <li className="nav-item">
          <button className="nav-btn">Generative Removal</button>
        </li>
      </ul>
      <ul className="nav-menu2 fixed-bottom">
        <li className="nav-item">
          <button className="nav-btn">Account</button>
        </li>
        <li className="nav-item">
          <button className="nav-btn">Get more credits</button>
        </li>
      </ul>
    </nav>
  );
};

export default LeftNavbar;
