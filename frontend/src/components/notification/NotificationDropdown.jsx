import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaExclamationCircle, FaCodeBranch, FaInfoCircle } from 'react-icons/fa';
import './notification.css';
import api from '../../services/api';

const NotificationDropdown = ({ notifications, onClose, onMarkAsRead }) => {
    const navigate = useNavigate();

    const getIcon = (type) => {
        switch (type) {
            case 'star': return <FaStar className="notification-icon star" />;
            case 'issue': return <FaExclamationCircle className="notification-icon issue" />;
            case 'commit': return <FaCodeBranch className="notification-icon commit" />;
            default: return <FaInfoCircle className="notification-icon" />;
        }
    };

    const handleItemClick = async (note) => {
        if (!note.read) {
            try {
                await api.notification.markAsRead(note._id);
                onMarkAsRead(note._id);
            } catch (err) {
                console.error("Failed to mark as read", err);
            }
        }
        onClose();
        if (note.link) {
            navigate(note.link);
        }
    };

    return (
        <div className="notification-dropdown">
            <div className="notification-header">
                <h3>Notifications</h3>
                {/* <button className="mark-all-read">Mark all as read</button> */}
            </div>
            <div className="notification-list">
                {notifications.length === 0 ? (
                    <div className="empty-notifications">No notifications yet.</div>
                ) : (
                    notifications.map(note => (
                        <div
                            key={note._id}
                            className={`notification-item ${!note.read ? 'unread' : ''}`}
                            onClick={() => handleItemClick(note)}
                        >
                            {getIcon(note.type)}
                            <div className="notification-content">
                                <div className="notification-message">{note.message}</div>
                                <div className="notification-time">
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationDropdown;
