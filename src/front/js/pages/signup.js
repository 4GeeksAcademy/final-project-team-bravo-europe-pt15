import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, FloatingLabel, Form, Button } from "react-bootstrap";


export const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    const errors = {};

    // Email validation
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }

    // Username validation
    if (!username.trim()) {
      errors.username = "Username is required";
    } else if (username.length < 4) {
      errors.username = "Username must be at least 4 characters long";
    }

    // Define specific regular expressions for each requirement
    const capitalLetterRequirement = /[A-Z]/;
    const digitRequirement = /\d/;
    const symbolRequirement = /[@$!%*?&.]/; // Updated to include "."
    const lengthRequirement = /.{8,}/;

    // Password validation
    if (!password.trim()) {
      errors.password = "Password is required";
    } else {
      if (!capitalLetterRequirement.test(password)) {
        errors.password = "Password must include at least one capital letter";
      }
      if (!digitRequirement.test(password)) {
        errors.password = "Password must include at least one digit";
      }
      if (!symbolRequirement.test(password)) {
        errors.password =
          "Password must include at least one special character (@, $, !, %, *, ?, &, .)";
      }
      if (!lengthRequirement.test(password)) {
        errors.password = "Password must be at least 8 characters long";
      }
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // If no errors, proceed with form submission
    if (Object.keys(errors).length === 0) {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, username, password }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.msg);
        }

        // Handle successful signup
        console.log("User signed up successfully!");
        navigate("/login"); // Navigate to login page
      } catch (error) {
        alert("User with this email already exists");
        console.error("Error signing up:", error.message);
      }
    } else {
      // Update errors state to display validation errors
      setErrors(errors);
    }
  };

  return (
    <div className="container">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <div className="signup-form">
            <h2>Signup</h2>
            <Form onSubmit={handleSubmit}>
              <FloatingLabel
                controlId="username"
                label="Username"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  isInvalid={!!errors.username}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </FloatingLabel>
              <FloatingLabel
                controlId="email"
                label="Email address"
                className="mb-3"
              >
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={!!errors.email}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </FloatingLabel>
              <FloatingLabel controlId="password" label="Password">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isInvalid={!!errors.password}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </FloatingLabel>
              <FloatingLabel
                controlId="confirmPassword"
                label="Confirm Password"
              >
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  isInvalid={!!errors.confirmPassword}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </FloatingLabel>
              <p>
                Password must be at least 8 characters long, include one capital
                letter, one digit, and one special character
              </p>
              <Button variant="primary" type="submit" className="mt-3">
                Signup
              </Button>
            </Form>
            <div>
              <p >
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
