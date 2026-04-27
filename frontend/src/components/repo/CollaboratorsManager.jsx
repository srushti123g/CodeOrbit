import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const CollaboratorsManager = ({ repoId, isOwner }) => {
    const [collaborators, setCollaborators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inviteUsername, setInviteUsername] = useState("");
    const [inviteRole, setInviteRole] = useState("contributor");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchCollaborators();
    }, [repoId]);

    const fetchCollaborators = async () => {
        try {
            const res = await api.repo.getCollaborators(repoId);
            setCollaborators(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching collaborators:", err);
            setLoading(false);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!inviteUsername) return;

        try {
            await api.repo.addCollaborator(repoId, inviteUsername, inviteRole);
            setSuccess(`Invited ${inviteUsername} as ${inviteRole}`);
            setInviteUsername("");
            fetchCollaborators();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to invite user");
        }
    };

    const handleRemove = async (userId) => {
        if (!window.confirm("Are you sure you want to remove this collaborator?")) return;
        try {
            await api.repo.removeCollaborator(repoId, userId);
            setSuccess("Collaborator removed");
            fetchCollaborators();
        } catch (err) {
            alert("Failed to remove collaborator");
        }
    };

    if (loading) return <div>Loading collaborators...</div>;

    return (
        <div className="collaborators-container">
            <h3 className="settings-section-title">Manage Access</h3>

            {isOwner && (
                <div className="invite-box settings-card">
                    <h4>Invite Collaborator</h4>
                    <form onSubmit={handleInvite} className="invite-form" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={inviteUsername}
                            onChange={(e) => setInviteUsername(e.target.value)}
                            className="search-input"
                            style={{ flex: 1 }}
                        />
                        <select
                            value={inviteRole}
                            onChange={(e) => setInviteRole(e.target.value)}
                            className="search-input"
                            style={{ width: '150px' }}
                        >
                            <option value="contributor">Contributor</option>
                            <option value="maintainer">Maintainer</option>
                            <option value="owner">Admin</option>
                        </select>
                        <button type="submit" className="repo-btn primary-btn">Add</button>
                    </form>
                    {error && <p className="error-text" style={{ color: 'var(--danger-color)', marginTop: '8px' }}>{error}</p>}
                    {success && <p className="success-text" style={{ color: 'var(--success-color)', marginTop: '8px' }}>{success}</p>}
                </div>
            )}

            <div className="collaborators-list settings-card">
                <h4>Current Collaborators</h4>
                {collaborators.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', padding: '10px 0' }}>No collaborators yet.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {collaborators.map((collab) => (
                            <li key={collab.user._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                        {collab.user.username[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600' }}>{collab.user.username}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{collab.role}</div>
                                    </div>
                                </div>
                                {isOwner && (
                                    <button
                                        onClick={() => handleRemove(collab.user._id)}
                                        className="repo-btn danger-btn"
                                        style={{ padding: '6px 12px', fontSize: '12px' }}
                                    >
                                        Remove
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CollaboratorsManager;
