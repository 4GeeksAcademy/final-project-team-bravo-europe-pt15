import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/navbar.css";
import { Context } from "../store/appContext";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLinkClick = () => {
    closeMenu();
  };

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

  const isDashboardOrImagesPage =
    location.pathname === "/dashboard" ||
    location.pathname === "/transformed-images";

  return (
    <div className="navbar-container">
      <nav
        className={`navbar ${scrolled ? "scrolled" : ""} ${
          isDashboardOrImagesPage ? "static" : ""
        }`}
      >
        <Link to="/" className="navbar-brand" onClick={handleLinkClick}>
          MAFL
        </Link>
        <div className="menu-icon" onClick={toggleMenu}>
          <div className={`menu-icon-line ${menuOpen ? "open" : ""}`}></div>
          <div className={`menu-icon-line ${menuOpen ? "open" : ""}`}></div>
          <div className={`menu-icon-line ${menuOpen ? "open" : ""}`}></div>
        </div>
        <div className={`contbut ${menuOpen ? "open" : ""}`}>
          {showLoggedInNavItems ? (
            <button className="btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <Link to="/" className="nav-link" onClick={handleLinkClick}>
                Home
              </Link>
              <Link
                to="/signup"
                className="btn Signin"
                onClick={handleLinkClick}
              >
                Signup
              </Link>
              <Link to="/login" className="btn Login" onClick={handleLinkClick}>
                Login
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};
