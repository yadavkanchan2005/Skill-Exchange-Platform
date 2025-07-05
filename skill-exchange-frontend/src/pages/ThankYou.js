// src/pages/ThankYou.js
import React from 'react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import { FaSmileBeam } from 'react-icons/fa';

const ThankYou = () => {
    const [width, height] = useWindowSize();

    return (
        <div className="position-relative bg-light" style={{ minHeight: '100vh' }}>
            <Confetti width={width} height={height} />

            <div className="container d-flex flex-column align-items-center justify-content-center text-center py-5" style={{ minHeight: '100vh' }}>
                <FaSmileBeam size={100} className="text-warning mb-3" />
                <h1 className="display-5 fw-bold text-success">Thank You! 🎉</h1>
                <p className="lead text-muted mb-4">
                    We truly appreciate you reaching out. <br />
                    Our team will get back to you shortly. Until then, keep exploring and exchanging skills! 🚀
                </p>
                <Link to="/" className="btn btn-primary px-4 py-2 rounded-pill shadow">
                    Go Back to Home
                </Link>
            </div>
        </div>
    );
};

export default ThankYou;
