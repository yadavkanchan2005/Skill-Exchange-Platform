
import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/SidebarComponent/Sidebar';
import './ViewProfile.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUserProfile();
                setUser(res.data);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    toast.error('Session expired. Please log in again.');
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="view-profile-page d-flex justify-content-center align-items-center">
                <div className="text-center">
                    <p className="text-danger fw-semibold">Failed to load user profile.</p>
                </div>
            </div>
        );
    }

    const profileImageUrl = user?.profilePicture
        ? `http://localhost:3000/uploads/${user?.profilePicture}`
        : "/default.png";


    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-main view-profile-page">
                <div className="profile-card animated-fade-in">

                    <div className="profile-top-section">
                        <img
                            src={profileImageUrl}
                            alt="Profile"
                            className="profile-image"
                        />

                        <div className="profile-basic-info">
                            <h3 className="profile-name">{user.name}</h3>
                            <p className="profile-email">{user.email}</p>
                        </div>
                    </div>



                    {/* Rest of Profile Details */}
                    <div className="profile-details mt-4">
                        <h4 className="Section-title mb-3">Profile Details</h4>
                        <div className="row g-3">
                            <div className="col-md-6 detail-item">
                                <strong>Name:</strong> <span>{user.name}</span>
                            </div>
                            <div className="col-md-6 detail-item">
                                <strong>Email:</strong> <span>{user.email}</span>
                            </div>
                            <div className="col-md-6 detail-item">
                                <strong>Gender:</strong> <span>{user.gender || 'Not specified'}</span>
                            </div>
                            <div className="col-md-6 detail-item">
                                <strong>DOB:</strong> <span>{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}</span>
                            </div>
                            <div className="col-md-6 detail-item">
                                <strong>Education:</strong> <span>{user.education || 'Not provided'}</span>
                            </div>
                            <div className="col-md-6 detail-item">
                                <strong>Languages:</strong> <span>{Array.isArray(user.languages) ? user.languages.join(', ') : user.languages || 'None'}</span>
                            </div>
                            <div className="col-md-6 detail-item">
                                <strong>Skills:</strong> <span>{Array.isArray(user.skills) && user.skills.length > 0 ? user.skills.join(', ') : 'No skills listed'}</span>
                            </div>
                            <div className="col-md-6 detail-item">
                                <strong>Experience:</strong> <span>{user.experienceLevel || 'Not specified'}</span>
                            </div>
                        </div>
                    </div>


                    <div className="mt-4 d-flex justify-content-center gap-3">
                        <button className="edit-btn" onClick={() => navigate('/edit-profile')}>
                            <i className="bi bi-pencil-square me-1"></i>Edit Profile
                        </button>
                        <button className="logout-btn" onClick={() => {
                            localStorage.removeItem('token');
                            navigate('/login');
                        }}>
                            <i className="bi bi-box-arrow-right me-1"></i>Logout
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        </div >
    );
};

export default ViewProfile;