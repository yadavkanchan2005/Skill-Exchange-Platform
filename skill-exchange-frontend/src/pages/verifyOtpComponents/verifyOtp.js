import React, { useState } from 'react';
import './verifyOtp.css';
import { verifyOtp } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyOtp = () => {
    const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();
        const activationToken = localStorage.getItem('activationToken');
        if (!activationToken) {
            toast.error('No activation token found. Please sign up again.');
            return;
        }

        const otp = otpDigits.join('');

        try {
            const response = await verifyOtp({ otp: Number(otp), activationToken });
            toast.success(response.data.message || 'OTP Verified Successfully!');
            localStorage.removeItem('activationToken');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            console.error('OTP verification error:', err);
            toast.error(err.response?.data?.message || 'Invalid OTP. Try again.');
        }
    };

    const handleOtpChange = (e, i) => {
        const val = e.target.value;

        if (/^\d?$/.test(val)) {
            const newOtpDigits = [...otpDigits];
            newOtpDigits[i] = val;
            setOtpDigits(newOtpDigits);

            if (val !== '' && i < 5) {
                const nextInput = document.getElementById(`otp-${i + 1}`);
                nextInput?.focus();
            }
        }
    };

    return (
        <div className="otp-bg d-flex justify-content-center align-items-center">
            <div className="otp-card text-center">
                <h4 className="fw-bold mb-2">Verification code</h4>
                <p className="mb-4 text-muted">Enter your 6 digit code sent to your email.</p>

                <form onSubmit={handleVerify}>
                    <div className="otp-boxes mb-4">
                        {otpDigits.map((digit, i) => (
                            <input
                                key={i}
                                id={`otp-${i}`}
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                className="otp-box"
                                value={digit}
                                onChange={(e) => handleOtpChange(e, i)}
                            />
                        ))}
                    </div>

                    <button type="submit" className="btn btn-verify w-100 mb-3">
                        Continue
                    </button>
                </form>

                <ToastContainer position="top-right" autoClose={3000} theme="colored" />
            </div>
        </div>
    );
};

export default VerifyOtp;
