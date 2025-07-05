import React, { useState, useEffect } from 'react';
import './ForgotPassword.css';
import logo from '../../assets/icons/forgotLogo.png';
import { useNavigate } from 'react-router-dom';
import welcomeImg from '../../assets/icons/forgot.webp';
import { forgotPassword } from '../../api/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [typedText, setTypedText] = useState('');
    const [fullPrompt] = useState("Hey! What's your registered email?");
    const [typingIndex, setTypingIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Typewriter animation
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

        if (!email) {
            toast.error('Please enter a valid email address.');
            return;
        }

        setLoading(true);

        try {
            const res = await forgotPassword({ email });
            console.log("OTP Response:", res.data);

            if (res.data.message === "OTP has been sent to your email.") {
                toast.success('OTP sent to your email!');
                localStorage.setItem("resetEmail", email);
                setTimeout(() => navigate('/reset-password'), 2000);
            } else {
                toast.error(res.data.message || 'Something went wrong.');
            }
        } catch (err) {
            console.error("Forgot Password Error:", err);
            const msg = err.response?.data?.message || 'Failed to send OTP.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-container">
            <div className="forgot-card">
                <div className="forgot-left">
                    <img src={welcomeImg} alt="Welcome Graphic" className="welcome-image" />
                    <h1>FORGOT PASSWORD</h1>
                    <p className="greeting-text">Don't worry! Let’s get you back in.</p>
                </div>

                <div className="forgot-right">
                    <img src={logo} alt="Logo" className="forgot-logo" />
                    <form onSubmit={handleSubmit} className="forgot-form">
                        <p className="typewriter-text">{typedText}</p>

                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>

                        <div className="extra-options">
                            <p onClick={() => navigate('/login')} className="link">Back to Login</p>
                        </div>
                    </form>
                </div>
            </div>

          
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        </div>
    );
};

export default ForgotPassword;
