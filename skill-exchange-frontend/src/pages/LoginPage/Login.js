import React, { useState, useRef, useEffect } from 'react';
import './Login.css';
import logo from '../../assets/icons/loginLogo.avif';
import { useNavigate } from 'react-router-dom';
import welcomeImg from '../../assets/icons/login.webp';
import { login } from '../../api/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPasswordField, setShowPasswordField] = useState(false);
    const [typedText, setTypedText] = useState('');
    const [fullPrompt, setFullPrompt] = useState("Hi! What's your email?");
    const [typingIndex, setTypingIndex] = useState(0);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const emailRef = useRef();
    const passwordRef = useRef();
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

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (!email.includes('@')) {
            setMessage('Please enter a valid email.');
            setMessageType('error');
            return;
        }

        setShowPasswordField(true);
        const name = email.split('@')[0];
        setTypedText('');
        setFullPrompt(`Great, ${name}! Now enter your password:`);
        setTypingIndex(0);
        setMessage('');
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login({ email, password });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }

             if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
            setMessage('Login successful!');
            setMessageType('success');

            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Invalid email or password.';
            setMessage(errorMsg);
            setMessageType('error');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-left">
                    <img src={welcomeImg} alt="Welcome Graphic" className="welcome-image" />
                    <h1>WELCOME</h1>
                    <p className="greeting-text">Exchange skills. Expand opportunities. Empower your journey!</p>
                </div>

                <div className="login-right">
                    <img src={logo} alt="Logo" className="login-logo" />
                    <form onSubmit={showPasswordField ? handleLoginSubmit : handleEmailSubmit} className="login-form">
                        <p className="typewriter-text">{typedText}</p>

                        {message && (
                            <p className={`login-message ${messageType === 'success' ? 'success' : 'error'}`}>
                                {message}
                            </p>
                        )}

                        {!showPasswordField && (
                            <>
                                <input
                                    ref={emailRef}
                                    className="input-field"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                />
                                <button type="submit" className="btn-primary">Next</button>
                            </>
                        )}

                        {showPasswordField && (
                            <>
                                <input
                                    ref={passwordRef}
                                    className="input-field"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                                <button type="submit" className="btn-primary">Login</button>
                            </>
                        )}

                        <div className="extra-options">
                            <p onClick={() => navigate('/forgot-password')} className="link">Forgot Password?</p>
                            <p>
                                Don’t have an account?{' '}
                                <span onClick={() => navigate('/signup')} className="link">Sign Up</span>
                            </p>
                            <p onClick={() => navigate('/')} className="link">Back To Home</p>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
