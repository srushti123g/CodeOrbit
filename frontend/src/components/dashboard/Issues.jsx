import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import api from '../../services/api';
import '../issue/issue.css';

const Issues = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const res = await api.issue.getAll();
                setIssues(res.data);
            } catch (err) {
                console.error("Error fetching all issues", err);
            } finally {
                setLoading(false);
            }
        };

        fetchIssues();
    }, []);

    const filteredIssues = issues.filter(issue =>
        issue.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="loading-skeleton">Loading issues...</div>;

    return (
        <div className="dashboard-content-elite">
            <header className="page-header-elite">
                <div className="projects-header">
                    <h2 className="section-title">All Issues</h2>
                </div>
                <div className="projects-controls-elite">
                    <input
                        type="text"
                        placeholder="Search issues across all repositories..."
                        className="search-input-elite"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            <div className="issue-list-container">
                {filteredIssues.length === 0 ? (
                    <div className="empty-state">No issues found.</div>
                ) : (
                    <div className="issue-list">
                        {filteredIssues.map(issue => (
                            <div key={issue._id} className="issue-item">
                                <div className={`issue-icon ${issue.status}`}>
                                    {issue.status === 'open' ? <FaExclamationCircle /> : <FaCheckCircle />}
                                </div>
                                <div className="issue-content">
                                    <Link to={`/repo/${issue.repository}/issues/${issue._id}`} className="issue-title">
                                        {issue.title}
                                    </Link>
                                    <div className="issue-meta">
                                        #{issue._id.slice(-4)} • {issue.status} • {new Date(issue.createdAt || Date.now()).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Issues;
