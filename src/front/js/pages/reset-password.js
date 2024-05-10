import React, { useEffect, useState } from 'react';
import '../../styles/reset-password.css';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate()

    useEffect(async () => {
        const token = searchParams.get("token")

        if(token) {
            fetch(`${process.env.BACKEND_URL}/api/check-token/${token}`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (!data.success) navigate('/forgot-password');
            })
            .catch((error) => {
                navigate('/forgot-password');
            });
        } else {
            navigate('/forgot-password');
        }
    },[])

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        fetch(`${process.env.BACKEND_URL}/api/reset-password/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ new_password: password }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.msg)
            navigate('/login')
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card w-50">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label">New Password:</label>
                            <input type="password" id="newPassword" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm New Password:</label>
                            <input type="password" id="confirmPassword" className="form-control" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};