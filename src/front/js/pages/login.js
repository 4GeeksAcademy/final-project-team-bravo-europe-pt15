import React, { useState } from "react";
import { Link } from "react-router-dom";

export const Login = () => {
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
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    {errors.password && <span className="error">{errors.password}</span>}
                </div>
                <button type="submit">Login</button>
            </form>
            <div>
                <Link to="/forgot-password">Forgot your password?</Link>
            </div>
        </div>
    );
};