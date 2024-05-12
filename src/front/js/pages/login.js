import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, FloatingLabel, Form, Button } from "react-bootstrap";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
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
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.msg);
        }

        // Handle successful login
        const data = await response.json();
        const token = data.token;

        // Log token to console
        console.log("Token:", token);

        // Store token in local storage
        localStorage.setItem("token", token);

        // Redirect to dashboard
        navigate("/dashboard");
      } catch (error) {
        console.error("Error logging in:", error.message);
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
          <div className="login-form">
            <h2>Login</h2>
            <Form onSubmit={handleSubmit}>
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
              <Button variant="primary" type="submit" className="mt-3">
                Login
              </Button>
            </Form>
            <div>
              <Link to="/forgot-password">Forgot your password?</Link>
            </div>
            <div>
              <p>
                Not yet a user? <Link to="/signup">Sign up here</Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
