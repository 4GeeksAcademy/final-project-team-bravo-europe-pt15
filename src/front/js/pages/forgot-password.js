import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom'; 
import '../../styles/forgot-password.css';
import { Context } from '../store/appContext';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const {store, actions} = useContext(Context);

    const handleSubmit = async (event) => {
        event.preventDefault();

        await fetch(`https://opulent-space-giggle-6qgw6w9g7qpfxx64-3001.app.github.dev/api/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                alert('A reset link will be sent to your email address if it exists in our system');
            } else {
                alert('Error sending reset email');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    return (
        <div className="forgot-password-container">
            <div>
                <h1 className="forgot-password-heading">Forgot your password?</h1>
                <p className="forgot-password-text">Enter your email address and we'll send you the link to reset password.</p>
            </div>
            <form className="forgot-password-form" onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </label>
                <input type="submit" value="Submit" />
            </form>
            <Link to="/login">Back to login page</Link> {/* Add real link to login page */}   
        </div>
    );
};