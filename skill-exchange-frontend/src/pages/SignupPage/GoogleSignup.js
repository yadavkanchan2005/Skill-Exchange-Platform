
import React from 'react';
import { auth, provider } from '../../components/firebase';
import { signInWithPopup } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { googleLogin } from '../../api/auth';
import "./Signup.css";
import 'react-toastify/dist/ReactToastify.css';

const GoogleSignup = () => {
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            const response = await googleLogin(idToken); 

            // Save data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            toast.success("Logged in with Google!");

            // // 🔁 Redirect to Dashboard
            // setTimeout(() => {
            //     navigate('/dashboard');
            // }, 1500);
            navigate("/dashboard")
        } catch (error) {
            console.error("Google login error:", error);
            toast.error("Google login failed");
        }
    };

    return (
        <div className="google-signup-wrapper">
            <button className="google-btn" onClick={handleGoogleLogin}>
                <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="google-logo"
                />
                Continue with Google
            </button>
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        </div>
    );
};

export default GoogleSignup;