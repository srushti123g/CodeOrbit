import React, { useState, useEffect } from 'react';
import { useAuth } from '../../authContext';
import api from '../../services/api';
import '../dashboard/dashboard.css'; // Reusing dashboard styles for consistency
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const { currentUser, setCurrentUser, signout } = useAuth(); // Assuming setCurrentUser is available to update context
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        bio: '',
        profileImage: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [notifications, setNotifications] = useState(true);

    useEffect(() => {
        if (currentUser) {
            setFormData({
                username: currentUser.username || '',
                email: currentUser.email || '',
                bio: currentUser.bio || '',
                profileImage: currentUser.profileImage || ''
            });
            setLoading(false);
        }
    }, [currentUser]);

    // Profile Update Handler
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await api.user.updateProfile(currentUser._id, {
                email: formData.email,
                bio: formData.bio,
                profileImage: formData.profileImage
            });
            // Update local context if possible/needed, or just alert
            alert("Profile updated successfully!");
            // Ideally update auth context here if user details changed
        } catch (err) {
            console.error(err);
            alert("Failed to update profile.");
        }
    };

    // Password Update Handler
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords do not match!");
            return;
        }
        try {
            await api.user.updateProfile(currentUser._id, {
                password: passwordData.newPassword
            });
            alert("Password updated successfully!");
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            console.error(err);
            alert("Failed to update password.");
        }
    };

    // Theme Toggle
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    // Account Deletion
    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            try {
                await api.user.deleteProfile(currentUser._id);
                signout();
                navigate('/login');
            } catch (err) {
                console.error(err);
                alert("Failed to delete account.");
            }
        }
    };

    if (loading) return <div className="loading-skeleton">Loading settings...</div>;

    return (
        <div className="dashboard-content">
            <h2 className="section-title">Settings</h2>

            <div className="settings-container" style={{ maxWidth: '800px', margin: '0 auto' }}>

                {/* Profile Information */}
                <div className="card settings-card" style={{ marginBottom: '24px', padding: '24px' }}>
                    <h3 className="card-title" style={{ marginBottom: '20px' }}>👤 Profile Information</h3>
                    <form onSubmit={handleProfileUpdate}>
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Username</label>
                            <input
                                type="text"
                                value={formData.username}
                                disabled
                                className="search-input"
                                style={{ width: '100%', cursor: 'not-allowed', opacity: 0.7 }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="search-input"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Bio</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="search-input"
                                style={{ width: '100%', minHeight: '80px', paddingTop: '10px' }}
                                placeholder="Tell us about yourself..."
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Profile Image URL</label>
                            <input
                                type="text"
                                value={formData.profileImage}
                                onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                                className="search-input"
                                style={{ width: '100%' }}
                                placeholder="https://..."
                            />
                        </div>
                        <button type="submit" className="repo-btn primary-btn">Save Changes</button>
                    </form>
                </div>

                {/* Security */}
                <div className="card settings-card" style={{ marginBottom: '24px', padding: '24px' }}>
                    <h3 className="card-title" style={{ marginBottom: '20px' }}>🔐 Security</h3>
                    <form onSubmit={handlePasswordUpdate}>
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>New Password</label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className="search-input"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Confirm Password</label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className="search-input"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <button type="submit" className="repo-btn primary-btn">Update Password</button>
                    </form>
                </div>

                {/* Preferences */}
                <div className="card settings-card" style={{ marginBottom: '24px', padding: '24px' }}>
                    <h3 className="card-title" style={{ marginBottom: '20px' }}>🌗 Preferences</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <span>Dark Mode</span>
                        <input
                            type="checkbox"
                            checked={theme === 'dark'}
                            onChange={toggleTheme}
                            style={{ transform: 'scale(1.5)' }}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>Email Notifications</span>
                        <input
                            type="checkbox"
                            checked={notifications}
                            onChange={() => setNotifications(!notifications)}
                            style={{ transform: 'scale(1.5)' }}
                        />
                    </div>
                </div>

                {/* Extras: API Keys (Mock) */}
                <div className="card settings-card" style={{ marginBottom: '24px', padding: '24px' }}>
                    <h3 className="card-title" style={{ marginBottom: '20px' }}>🔑 API Keys</h3>
                    <div style={{ padding: '15px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', marginBottom: '15px' }}>
                        <code style={{ wordBreak: 'break-all' }}>co_live_5X8493...9483</code>
                        <div style={{ fontSize: '12px', color: 'gray', marginTop: '5px' }}>Last used: Just now</div>
                    </div>
                    <button className="repo-btn secondary-btn" onClick={() => alert("Generate API Key mock action")}>Generate New Key</button>
                </div>

                {/* Danger Zone */}
                <div className="card settings-card" style={{ marginBottom: '24px', padding: '24px', border: '1px solid #ef4444' }}>
                    <h3 className="card-title" style={{ marginBottom: '10px', color: '#ef4444' }}>⚠️ Danger Zone</h3>
                    <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>Once you delete your account, there is no going back. Please be certain.</p>
                    <button onClick={handleDeleteAccount} className="repo-btn primary-btn" style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }}>
                        Delete Account
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Settings;
