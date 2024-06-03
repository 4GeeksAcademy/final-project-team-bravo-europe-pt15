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

  useEffect(() => {
    actions.checkAuth();
  }, [location.pathname]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLinkClick = (e) => {
    if (store.isLoggedIn) {
      e.preventDefault();
    } else {
      closeMenu();
    }
  };

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

  const isResetPasswordPage = location.pathname === "/reset-password";
  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";

  return (
    <div className="navbar-container">
      <nav
        className={`navbar ${scrolled ? "scrolled" : ""} ${isDashboardOrImagesPage ? "static" : ""}`}
      >
        <Link to="/" className="navbar-brand" onClick={handleLinkClick}>
          MAFL
        </Link>
        {!isResetPasswordPage && (
          <>
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
                  {!isLoginPage && !isSignupPage && (
                    <>
                      <Link
                        to="/signup"
                        className="btn Signin"
                        onClick={handleLinkClick}
                      >
                        Signup
                      </Link>
                      <Link
                        to="/login"
                        className="btn Login"
                        onClick={handleLinkClick}
                      >
                        Login
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </nav>
    </div>
  );
};
