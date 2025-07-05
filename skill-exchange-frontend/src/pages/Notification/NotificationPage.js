import React, { useEffect, useState } from 'react';
import {
    getNotifications,
    markNotificationAsRead,
    acceptExchangeRequest,
    rejectExchangeRequest
} from '../../api/auth';
import './NotificationPage.css';
import { FaBell, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const NotificationPage = ({ setUnreadCount }) => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [snackbar, setSnackbar] = useState({ message: '', type: '', visible: false });

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await getNotifications();
                setNotifications(res.data);
                const unread = res.data.filter(n => !n.isRead).length;
                setUnreadCount(unread);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        };

        fetchNotifications();
    }, [setUnreadCount]);

    useEffect(() => {
        const socket = window.socket;
        if (socket) {
            socket.on('newNotification', (data) => {
                setNotifications(prev => [data, ...prev]);
                setUnreadCount(prev => prev + 1);
            });
        }

        return () => {
            if (socket) socket.off('newNotification');
        };
    }, [setUnreadCount]);

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(prev =>
                prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
            );
            setUnreadCount(prev => Math.max(prev - 1, 0));
        } catch (err) {
            console.error('Error marking notification as read', err);
        }
    };

    const showSnackbar = (message, type = 'success') => {
        setSnackbar({ message, type, visible: true });
        setTimeout(() => setSnackbar({ message: '', type: '', visible: false }), 3000);
    };

    const handleAccept = async (requestId, notifId) => {
        try {
            await acceptExchangeRequest(requestId);
            await handleMarkAsRead(notifId);
            showSnackbar('Request accepted!', 'success');
        } catch (error) {
            showSnackbar('Failed to accept request.', 'error');
        }
    };

    const handleReject = async (requestId, notifId) => {
        try {
            await rejectExchangeRequest(requestId);
            await handleMarkAsRead(notifId);
            showSnackbar('Request rejected.', 'success');
        } catch (error) {
            showSnackbar('Failed to reject request.', 'error');
        }
    };

    const filteredNotifications =
        filter === 'all'
            ? notifications
            : notifications.filter(n => !n.isRead);

    return (
        <div className="notification-page">
            <h2><FaBell className="notif-icon" /> Notifications</h2>

            <div className="filter-buttons">
                <button
                    className={filter === 'all' ? 'active' : ''}
                    onClick={() => setFilter('all')}
                >
                    All
                </button>
                <button
                    className={filter === 'unread' ? 'active' : ''}
                    onClick={() => setFilter('unread')}
                >
                    Unread
                </button>
            </div>

            <ul className="notification-list">
                {filteredNotifications.length === 0 ? (
                    <li className="empty">No {filter} notifications found.</li>
                ) : (
                    filteredNotifications.map((notif) => (
                        <li
                            key={notif._id}
                            className={`notif-card ${notif.isRead ? 'read' : 'unread'}`}
                            onClick={() => handleMarkAsRead(notif._id)}
                        >
                            <div className="notif-header">
                                <FaBell className="notif-bell" />
                                <span className="notif-msg">{notif.message}</span>
                                <small>{new Date(notif.createdAt).toLocaleString()}</small>
                            </div>

                            {notif.type === 'exchange-request' && !notif.isRead && notif.requestId && (
                                <div className="notification-actions">
                                    <button className="accept" onClick={(e) => {
                                        e.stopPropagation();
                                        handleAccept(notif.requestId, notif._id);
                                    }}>
                                        <FaCheckCircle /> Accept
                                    </button>
                                    <button className="reject" onClick={(e) => {
                                        e.stopPropagation();
                                        handleReject(notif.requestId, notif._id);
                                    }}>
                                        <FaTimesCircle /> Reject
                                    </button>
                                </div>
                            )}
                        </li>
                    ))
                )}
            </ul>

            {snackbar.visible && (
                <div className={`snackbar ${snackbar.type}`}>
                    {snackbar.message}
                </div>
            )}
        </div>
    );
};

export default NotificationPage;
