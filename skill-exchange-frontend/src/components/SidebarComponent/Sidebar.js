import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getUserProfile } from '../../api/auth';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await getUserProfile();
                setUser(res.data);
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
            }
        };

        fetchUserProfile();
    }, []);

    const profileImageUrl = user?.profilePicture
        ? `https://skill-exchange-platform-pamq.onrender.com/uploads/${user?.profilePicture}`
        : "/default.png";

    return (
        <div className="sidebar">
            <nav className="sidebar-nav">
                <div className="profile-left">
                    <img
                        src={profileImageUrl}
                        alt="Profile"
                        className="profile-Image"
                    />
                </div>
                <div className="profile-right">
                    <h4>{user?.name || "User"}</h4>
                </div>
                <NavLink to="/dashboard" className="sidebar-link">
                    <i className="bi bi-speedometer2 me-2"></i> Dashboard
                </NavLink>
                <NavLink to="/my-profile" className="sidebar-link">
                    <i className="bi bi-person-circle me-2"></i> Profile
                </NavLink>
                <NavLink to="/my-skill" className="sidebar-link">
                    <i className="bi bi-lightbulb me-2"></i> My Skill
                </NavLink>

                <NavLink to="/explore-skills" className="sidebar-link">
                    <i className="bi bi-search me-2"></i> Explore Skills
                </NavLink>

                <NavLink to="/exchange-requests" className="sidebar-link">
                    <i className="bi bi-arrow-repeat me-2"></i> Exchange Requests
                </NavLink>
                <NavLink to="/notifications" className="sidebar-link">
                    <i className="bi bi-bell me-2"></i> Notifications
                </NavLink>
                <NavLink to="/messages" className="sidebar-link">
                    <i className="bi bi-chat-dots me-2"></i> Messages
                </NavLink>

                <button className="logout" onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                }}>
                    <i className="bi bi-box-arrow-right me-2"></i>Logout </button>
            </nav>
        </div>
    );
};

export default Sidebar;

