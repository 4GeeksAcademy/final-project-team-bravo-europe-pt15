import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../../styles/reset-password.css";

export const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const [successMessage, setSuccessMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password); 
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbol = /\W/.test(password);
    const hasEightCharacters = password.length >= 8;

    return hasUpperCase && hasLowerCase && hasNumbers && hasSymbol && hasEightCharacters;
  };

  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = searchParams.get("token");
      if (!token) {
        navigate("/forgot-password");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.BACKEND_URL}/api/check-token/${token}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Token is invalid");
        }

        const data = await response.json();
        if (!data.success) {
          navigate("/forgot-password");
        }
      } catch (error) {
        console.error("Error checking token validity:", error);
        navigate("/forgot-password");
      }
    };

    checkTokenValidity();
  }, [searchParams, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage("Password must be at least 8 characters long, include one capital letter, one digit, and one special character");
      return;
    }

    try {
      const token = searchParams.get("token");
      const response = await fetch(
        `${process.env.BACKEND_URL}/api/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ new_password: password }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      const data = await response.json();
      setSuccessMessage(data.msg);
      navigate("/login");
    } catch (error) {
      console.error("Error resetting password:", error);
      setErrorMessage("Error resetting password");
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card w-50">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">
                New Password:
              </label>
              <input
                type="password"
                id="newPassword"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm New Password:
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};