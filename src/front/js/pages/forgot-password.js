import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../styles/forgot-password.css";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/api/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      console.log(data);
      Swal.fire({
        title: "Success!",
        text: data.msg,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/");
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card-body">
        <h1 className="card-title">Forgot your password?</h1>
        <p className="card-text">
          Enter your email address and we'll send you the link to reset
          password.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="buttonwrapper">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
        {/* <Link to="/login" className="btn btn-link">Back to login page</Link> Add real link to login page */}
      </div>
    </div>
  );
};
