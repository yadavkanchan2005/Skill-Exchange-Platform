
import React, { useEffect, useState } from 'react';
import {
  getUserProfile,
  getExchangeRequestCounts,
  getUserProgress,
  getPassedSkills,
} from '../../api/auth';

import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/SidebarComponent/Sidebar';
import './Dashboard.css';
import socket from '../../Utils/socket';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState({
    completedCount: 0,
    experienceLevel: 'Beginner',
    badges: []
  });
  const [counts, setCounts] = useState({
    pending: 0,
    accepted: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [passedSkills, setPassedSkills] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUserProfile();
        setUser(res.data);
        socket.emit('join', res.data.id);

        const progressRes = await getUserProgress();
        setProgress(progressRes.data);
        console.log(progressRes.data);


        const countRes = await getExchangeRequestCounts();
        setCounts(countRes.data);
        console.log(countRes.data);


      } catch (error) {
        console.error('Failed to fetch data:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    socket.on('notification', (data) => {
      setNotificationMessage(data.message);
      setShowNotification(true);

      setTimeout(() => {
        setShowNotification(false);
        setNotificationMessage('');
      }, 4000);
    });

    return () => {
      socket.off('notification');
    };
  }, []);

  useEffect(() => {
    const fetchPassed = async () => {
      const res = await getPassedSkills();
      setPassedSkills(res.data);
    };
    fetchPassed();
  }, []);


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  const profileImageUrl = user?.profilePicture
    ? `https://skill-exchange-platform-pamq.onrender.com/uploads/${user?.profilePicture}`
    : "/default.png";


  const progressPercent = Math.min(progress.completedCount * 10, 100);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
        <div className="profile-header">
          <div className="profile-left">
            <img src={profileImageUrl} alt="Profile" className="profile-image" />
          </div>
          <div className="profileright">
            <h2>Welcome back, {user?.name}!</h2>
            <p>{user?.email}</p>
            <p><strong>Profile Level:</strong> {progress.experienceLevel}</p>
            <p>
              <strong>Badges:</strong>{' '}
              {progress.badges.length > 0 ? progress.badges.join(', ') : 'No badges yet'}
            </p>

            <div className="progress mt-2" style={{ height: '20px', width: '80%' }}>
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${progressPercent}%` }}
                aria-valuenow={progressPercent}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {progressPercent}%
              </div>
            </div>
            <small>{progress.completedCount} skills completed</small>


          </div>
        </div>

        <div className="exchange-summary">
          <h3>Exchange Request Summary</h3>
          <div className="summary-cards">
            <div className="summary-card pending">Pending: {counts.pending}</div>
            <div className="summary-card accepted">Accepted: {counts.accepted}</div>
            <div className="summary-card rejected">Rejected: {counts.rejected}</div>
          </div>
        </div>
        <div className="dashboard-section">

          <div className="passed-skills mb-5">
            <h4 className="mb-3">Skills You've Passed</h4>
            {passedSkills.length === 0 ? (
              <p className="text-muted">No skills passed yet.</p>
            ) : (
              <div className="row">
                {passedSkills.map((skill, i) => (
                  <div className="col-md-6 mb-4" key={i}>
                    <div className="card shadow-sm h-100 border-success">
                      <div className="card-body">
                        <h5 className="card-title text-capitalize text-success">
                          {skill.skillName}
                        </h5>
                        <p className="card-text mb-2">
                          <strong>Learned from:</strong>{' '}
                          <span className="text-primary fw-semibold">
                            {skill.learnedFrom}
                          </span>
                        </p>
                        <p className="card-text mb-2">
                          <strong>Completed on:</strong>{' '}
                          {new Date(skill.date).toLocaleDateString()}
                        </p>
                        <p className="card-text mb-0">
                          <strong>Score:</strong>{' '}
                          <span className="badge bg-success fs-6">
                            {skill.score}/20
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {showNotification && (
          <div className="notification-toast">
            {notificationMessage}
          </div>
        )}
      </div>



    </div>
  );
};

export default Dashboard;
