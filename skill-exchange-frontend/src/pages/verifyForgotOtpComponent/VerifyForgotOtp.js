import React, { useState, useEffect } from 'react';
import './VerifyForgotOtp.css';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/icons/loginLogo.avif';
import { verifyForgotOtp } from '../../api/auth';

const VerifyForgotOtp = () => {
    const [otp, setOtp] = useState('');
    const [typedText, setTypedText] = useState('');
    const [fullPrompt, setFullPrompt] = useState("Enter the OTP we just emailed you.");
    const [typingIndex, setTypingIndex] = useState(0);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

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

        try {
            const response = await verifyForgotOtp(otp);

            setMessage(response.data.message);
            setMessageType('success');

            setTimeout(() => {
                navigate('/reset-password-form'); // Next screen
            }, 2000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Invalid OTP or server error.';
            setMessage(errorMsg);
            setMessageType('error');
        }
    };

    return (
        <div className="verify-otp-container">
            <div className="verify-otp-card">
                <img src={logo} alt="Logo" className="verify-otp-logo" />
                <form onSubmit={handleSubmit} className="verify-otp-form">
                    <p className="verify-otp-text">{typedText}</p>

                    {message && (
                        <p className={`verify-otp-message ${messageType === 'success' ? 'verify-otp-success' : 'verify-otp-error'}`}>
                            {message}
                        </p>
                    )}

                    <input
                        type="text"
                        className="verify-otp-input"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        required
                    />
                    <button type="submit" className="verify-otp-btn">Verify OTP</button>
                </form>
            </div>
        </div>
    );
};

export default VerifyForgotOtp;
