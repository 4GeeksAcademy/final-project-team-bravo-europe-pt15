import React, { useState } from 'react';
import '../../styles/reset-password.css';

export const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        fetch(`/reset-password/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Password has been reset');
            } else {
                alert('Error resetting password');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    return (
        <div className="reset-password-container">
            <form onSubmit={handleSubmit} className="reset-password-form">
                <label>
                    New Password:
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                <label>
                    Confirm New Password:
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};