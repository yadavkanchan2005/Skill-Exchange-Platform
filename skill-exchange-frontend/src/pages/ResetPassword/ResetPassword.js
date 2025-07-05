import React, { useState, useEffect } from 'react';
import './ResetPassword.css';
import logo from '../../assets/icons/loginLogo.avif';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../api/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPasswordForm = () => {
    const [typedText, setTypedText] = useState('');
    const [fullPrompt, setFullPrompt] = useState('Please enter the OTP and your new password:');
    const [typingIndex, setTypingIndex] = useState(0);

    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [email] = useState(localStorage.getItem('resetEmail') || '');

    const navigate = useNavigate();

    useEffect(() => {
        if (typingIndex < fullPrompt.length) {
            const timeout = setTimeout(() => {
                setTypedText((prev) => prev + fullPrompt.charAt(typingIndex));
                setTypingIndex((prev) => prev + 1);
            }, 40);
            return () => clearTimeout(timeout);
        }
    }, [typingIndex, fullPrompt]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!otp || !newPassword) {
            toast.error("Please enter OTP and new password.");
            return;
        }

        setLoading(true);
        try {
            const response = await resetPassword({
                email,
                otp,
                newPassword,
            });

            toast.success(response.data.message || "Password reset successful.");
            localStorage.removeItem('resetEmail');

            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Failed to reset password.";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-pass-container">
            <div className="reset-pass-card">
                <img src={logo} alt="Logo" className="reset-pass-logo" />
                <form onSubmit={handleSubmit} className="reset-pass-form">
                    <p className="reset-pass-typewriter">{typedText}</p>

                    <input
                        type="text"
                        className="reset-pass-input"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        required
                    />

                    <input
                        type="password"
                        className="reset-pass-input"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                        required
                    />

                    <input
                        type="email"
                        className="reset-pass-input"
                        value={email}
                        disabled
                    />

                    <button type="submit" className="reset-pass-btn" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>

            {/* Toastify container */}
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        </div>
    );
};

export default ResetPasswordForm;
