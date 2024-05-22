import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../styles/navbar.css";
import { Context } from "../store/appContext";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    actions.checkAuth();
  }, [location.pathname]);

  const handleLogout = () => {
    actions.logout();
    navigate("/");
  };

  const showLoggedInNavItems =
    store.isLoggedIn &&
    (location.pathname === "/dashboard" ||
      location.pathname === "/transformed-images");

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <Link to="/" className="navbar-brand">
        MAFL
      </Link>
      <div className="contbut">
        {showLoggedInNavItems ? (
          <button className="btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/signup" className="btn Signin">
              Signup
            </Link>
            <Link to="/login" className="btn Login">
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
