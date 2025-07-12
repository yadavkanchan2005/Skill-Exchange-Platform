import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getUserProfile } from '../../api/auth';
import './Sidebar.css';

const Sidebar = () => {
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
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
        <>
            <button className="sidebar-toggle-button" onClick={() => setIsOpen(!isOpen)}>
                <i className="bi bi-list"></i>
            </button>

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <nav className="sidebar-nav">
                    <div className="profile-left">
                        <img src={profileImageUrl} alt="Profile" className="profile-Image" />
                    </div>
                    {isOpen && (
                        <div className="profile-right">
                            <h4>{user?.name || "User"}</h4>
                        </div>
                    )}

                    <NavLink to="/dashboard" className="sidebar-link">
                        <i className="bi bi-speedometer2"></i>
                        <span className="link-text">Dashboard</span>
                    </NavLink>
                    <NavLink to="/my-profile" className="sidebar-link">
                        <i className="bi bi-person-circle"></i>
                        <span className="link-text">Profile</span>
                    </NavLink>
                    <NavLink to="/my-skill" className="sidebar-link">
                        <i className="bi bi-lightbulb"></i>
                        <span className="link-text">My Skill</span>
                    </NavLink>
                    <NavLink to="/explore-skills" className="sidebar-link">
                        <i className="bi bi-search"></i>
                        <span className="link-text">Explore Skills</span>
                    </NavLink>
                    <NavLink to="/exchange-requests" className="sidebar-link">
                        <i className="bi bi-arrow-repeat"></i>
                        <span className="link-text">Exchange Requests</span>
                    </NavLink>
                    <NavLink to="/notifications" className="sidebar-link">
                        <i className="bi bi-bell"></i>
                        <span className="link-text">Notifications</span>
                    </NavLink>
                    <NavLink to="/messages" className="sidebar-link">
                        <i className="bi bi-chat-dots"></i>
                        <span className="link-text">Messages</span>
                    </NavLink>
                    <button className="logout" onClick={() => {
                        localStorage.removeItem('token');
                        navigate('/login');
                    }}>
                        <i className="bi bi-box-arrow-right"></i>
                        <span className="link-text">Logout</span>
                    </button>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
