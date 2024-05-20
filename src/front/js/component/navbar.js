import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar.css";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <Link to="/" className="navbar-brand">
        MAFL
      </Link>
      <div className="contbut">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/signup" className="btn Signin">
          Signup
        </Link>
        <Link to="/login" className="btn Login">
          Login
        </Link>
      </div>
    </nav>
  );
};
