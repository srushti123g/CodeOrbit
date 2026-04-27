import React, { useState, useEffect } from "react";
import api from "../../services/api";
import EmptyState from "../common/EmptyState";
import Skeleton from "../common/Skeleton";
import "./repoDetail.css";

const RepoPullRequests = ({ repoId, onCreatePrClick }) => {
    const [prs, setPrs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPrs();
    }, [repoId]);

    const fetchPrs = async () => {
        try {
            const res = await api.pr.getAll(repoId);
            setPrs(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching PRs:", err);
            setLoading(false);
        }
    };

    if (loading) return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <Skeleton width="150px" height="36px" />
            </div>
            {[1, 2, 3].map(i => (
                <Skeleton key={i} width="100%" height="80px" style={{ marginBottom: '16px' }} />
            ))}
        </div>
    );

    return (
        <div className="pr-list-container">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <button className="btn-primary" onClick={onCreatePrClick}>New Pull Request</button>
            </div>

            {prs.length === 0 ? (
                <EmptyState
                    icon="🔀"
                    title="No Pull Requests yet"
                    description="Collaborate on this repository by proposing changes via Pull Requests."
                />
            ) : (
                <div className="issue-list" style={{ border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                    {prs.map(pr => (
                        <div key={pr._id} className="issue-item" style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '10px' }}>
                            <div className="pr-icon" style={{ color: pr.status === 'open' ? '#238636' : (pr.status === 'merged' ? '#8957e5' : '#da3633') }}>
                                {pr.status === 'merged' ? '🔀' : (pr.status === 'closed' ? '🚫' : '🟢')}
                            </div>
                            <div className="pr-content" style={{ flex: 1 }}>
                                <div style={{ fontWeight: '600', fontSize: '16px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                                    {pr.title}
                                </div>
                                <div className="pr-meta" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                    #{pr._id.substring(0, 6)} opened by {pr.author?.username || 'Unknown'} • {pr.sourceBranch} ➝ {pr.targetBranch}
                                </div>
                            </div>
                            <div className="pr-status">
                                <span className={`status-badge ${pr.status}`} style={{
                                    padding: '2px 8px', borderRadius: '12px', fontSize: '12px',
                                    border: '1px solid var(--border-color)',
                                    background: pr.status === 'open' ? 'rgba(35, 134, 54, 0.1)' : 'var(--bg-secondary)',
                                    color: pr.status === 'open' ? '#238636' : 'var(--text-secondary)'
                                }}>
                                    {pr.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RepoPullRequests;
