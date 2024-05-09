import React, { useState } from "react";
import { Link } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../../styles/login-test.css";

export const LoginTest = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation logic
    const errors = {};
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }
    if (!password.trim()) {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length === 0) {
      // Form is valid, proceed with submission
    } else {
      setErrors(errors);
    }
  };

  return (
    <div className="login-container container">
      <div className="login-content">
        <div className="top-right">
          <Link to="/signup">
            <Button variant="primary">Signup</Button>
          </Link>
        </div>
        <h2>Login</h2>
        <Form onSubmit={handleSubmit}>
          <FloatingLabel controlId="email" label="Email:" className="mb-3">
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </FloatingLabel>
          <FloatingLabel
            controlId="password"
            label="Password:"
            className="mb-3"
          >
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </FloatingLabel>
          <div className="login-buttons">
            <Button type="submit">Login</Button>
            <Link to="/forgot-password" className="forgot-password">
              Forgot your password?
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};
