import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from 'sweetalert2';
import "../../styles/reset-password.css";

export const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Add states for each condition
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasNumbers, setHasNumbers] = useState(false);
  const [hasSymbol, setHasSymbol] = useState(false);
  const [hasEightCharacters, setHasEightCharacters] = useState(false);

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPassword(password);

    // Check each condition and update the state
    setHasUpperCase(/[A-Z]/.test(password));
    setHasLowerCase(/[a-z]/.test(password));
    setHasNumbers(/[0-9]/.test(password));
    setHasSymbol(/\W/.test(password));
    setHasEightCharacters(password.length >= 8);
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

    // checkTokenValidity();
  }, [searchParams, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage(<p className="error-message">Passwords do not match</p>);
      return;
    }

    if (
      !hasUpperCase ||
      !hasLowerCase ||
      !hasNumbers ||
      !hasSymbol ||
      !hasEightCharacters
    ) {
      setErrorMessage(
        <p className="error-message">
          Password must be at least 8 characters long, include one capital
          letter, one digit, and one special character
        </p>
      );
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
      Swal.fire({
        title: 'Success!',
        text: data.msg,
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Error resetting password',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">
              New Password:
            </label>
            <input
              type="password"
              id="newPassword"
              className="form-control"
              value={password}
              onChange={handlePasswordChange} // Use the new handler
              required
            />
            {/* Display the status of each condition */}
            <div className="password-conditions">
              <p className={hasUpperCase ? "condition-met" : "condition-unmet"}>
                Has uppercase
              </p>
              <p className={hasLowerCase ? "condition-met" : "condition-unmet"}>
                Has lowercase
              </p>
              <p className={hasNumbers ? "condition-met" : "condition-unmet"}>
                Has number
              </p>
              <p className={hasSymbol ? "condition-met" : "condition-unmet"}>
                Has symbol
              </p>
              <p
                className={
                  hasEightCharacters ? "condition-met" : "condition-unmet"
                }
              >
                Has at least 8 characters
              </p>
            </div>
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
          <div className="buttonwrapper">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
