import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleForgotPassword = async () => {
        try {
            await axios.post('http://localhost:5000/users/forgot-password', { email });
            setStep(2);
            setMessage('OTP sent to your phone number');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to send OTP');
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const res = await axios.post('http://localhost:5000/users/verify-otp', { email, otp });
            localStorage.setItem('resetToken', res.data.token);
            setStep(3);
            setMessage('OTP verified successfully');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to verify OTP');
        }
    };

    const handleResetPassword = async () => {
        try {
            const token = localStorage.getItem('resetToken');
            await axios.post('http://localhost:5000/users/reset-password', { token, newPassword });
            setMessage('Password reset successfully');
            setStep(1);
            navigate('/login');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to reset password');
        }
    };

    const cancel = () => {
        navigate('/login');
    }

    return (
        <div className="Forgot-container">
            {step === 1 && (
                <div>
                    <h2>Forgot Password</h2>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <div className='Forgot-buttons'>
                        <button onClick={handleForgotPassword}>Send OTP</button>
                        <button onClick={cancel}>Cancel</button>
                    </div>
                </div>
            )}
            {step === 2 && (
                <div>
                    <h2>Verify OTP</h2>
                    <input 
                        type="text" 
                        placeholder="OTP" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                    />
                    <div className='Forgot-buttons'>
                        <button onClick={cancel}>Cancel</button>
                        <button onClick={handleVerifyOtp}>Verify</button>
                    </div>
                </div>
            )}
            {step === 3 && (
                <div>
                    <h2>Reset Password</h2>
                    <input 
                        type="password" 
                        placeholder="New Password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                    />
                    <div className='Forgot-buttons'>
                        <button onClick={cancel}>Cancel</button>
                        <button onClick={handleResetPassword}>Reset</button>
                    </div>
                </div>
            )}
            {message && <p>{message}</p>}
        </div>
    );
}

export default ForgotPassword;
