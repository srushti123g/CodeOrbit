import React, { useState, useEffect, useRef } from 'react'; // Add hooks
import { FaSearch, FaPlus, FaBell, FaUserCircle, FaSun, FaMoon } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Topbar.css';
import { useAuth } from '../../authContext';
import { useTheme } from '../../ThemeContext';
import NotificationDropdown from '../notification/NotificationDropdown';
import api from '../../services/api'; // Import api

const Topbar = () => {
    const { currentUser } = useAuth();
    const username = localStorage.getItem("username") || "User";
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    // Notification State
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const notificationRef = useRef(null);

    // Profile Dropdown State
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const profileRef = useRef(null);
    const { signout } = useAuth(); // Destructure signout

    const fetchNotifications = async () => {
        try {
            // Only fetch if logged in
            if (currentUser || localStorage.getItem("token")) {
                const res = await api.notification.getAll();
                setNotifications(res.data);
                setUnreadCount(res.data.filter(n => !n.read).length);
            }
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [currentUser]);

    const handleLogout = () => {
        signout();
        navigate('/login');
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleMarkAsRead = (id) => {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    return (
        <header className="topbar">
            {/* ... existing search ... */}
            <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search repositories..."
                    className="search-input"
                />
            </div>

            <div className="topbar-actions">
                <button className="theme-toggle-btn" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
                    {theme === 'dark' ? <FaSun className="theme-icon sun" /> : <FaMoon className="theme-icon moon" />}
                </button>

                <button className="create-btn" onClick={() => navigate("/create-repo")}>
                    <FaPlus /> New
                </button>

                <div className="notification-wrapper" ref={notificationRef}>
                    <button
                        className="icon-btn"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <FaBell />
                        {unreadCount > 0 && <span className="notification-dot"></span>}
                    </button>

                    {showNotifications && (
                        <NotificationDropdown
                            notifications={notifications}
                            onClose={() => setShowNotifications(false)}
                            onMarkAsRead={handleMarkAsRead}
                        />
                    )}
                </div>

                <div className="user-profile" ref={profileRef} onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
                    <div className="avatar">
                        {username.charAt(0).toUpperCase()}
                    </div>

                    {showProfileDropdown && (
                        <div className="profile-dropdown">
                            <div className="dropdown-header">
                                <span className="username">{username}</span>
                            </div>
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item" onClick={() => navigate(`/profile/${currentUser}`)}>
                                <FaUserCircle /> Your Profile
                            </button>
                            <button className="dropdown-item" onClick={() => navigate('/settings')}>
                                <FaUserCircle /> Settings
                            </button>
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item logout" onClick={handleLogout}>
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Topbar;
