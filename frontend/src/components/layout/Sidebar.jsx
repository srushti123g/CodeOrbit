import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaBox, FaExclamationCircle, FaChartLine, FaCog, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import './Sidebar.css';
import { useAuth } from '../../authContext';

const Sidebar = () => {
    const { signout } = useAuth();
    const navigate = useNavigate();
    const username = localStorage.getItem("username") || "Developer";

    const handleLogout = () => {
        signout();
        navigate('/login');
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-icon" style={{
                    width: '32px', height: '32px',
                    background: 'var(--primary-color)',
                    borderRadius: '8px',
                    color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                }}>CO</div>
                <span className="logo-text">CodeOrbit</span>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section-label">Main</div>
                <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <FaHome className="nav-icon" />
                    <span>Workspace</span>
                </NavLink>
                <NavLink to="/repositories" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <FaBox className="nav-icon" />
                    <span>Projects</span>
                </NavLink>
                <NavLink to="/issues" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <FaExclamationCircle className="nav-icon" />
                    <span>Issues</span>
                </NavLink>
                <NavLink to="/activity" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <FaChartLine className="nav-icon" />
                    <span>Timeline</span>
                </NavLink>

                <div className="nav-section-label" style={{ marginTop: '16px' }}>Settings</div>
                <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <FaCog className="nav-icon" />
                    <span>Settings</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile-card">
                    <div className="user-avatar-sm">
                        {username.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                        <span className="user-name">{username}</span>
                        <span className="user-plan">Pro Plan</span>
                    </div>
                    <button onClick={handleLogout} className="icon-btn-ghost" title="Logout" style={{ padding: '8px' }}>
                        <FaSignOutAlt style={{ color: 'var(--text-secondary)' }} />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
