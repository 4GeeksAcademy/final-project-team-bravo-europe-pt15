import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Form, Button } from "react-bootstrap";
import { loginUser } from "../utils/authUtils"; // Import the login utility
import Swal from "sweetalert2";
import "../../styles/login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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
      // Form is valid, proceed with login
      await loginUser(email, password, navigate);
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
              <Form.Group controlId="email" className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={!!errors.email}
                  required
                  autoFocus
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="password">
                <div className="password-input">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={!!errors.password}
                    required
                  />
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-icon"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>
              <div className="buttonwrapper">
                <Button variant="primary" type="submit" className="mt-3">
                  Login
                </Button>
              </div>
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
