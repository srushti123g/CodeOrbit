import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationCircle, FaCheckCircle, FaComments } from 'react-icons/fa';
import api from '../../services/api';
import EmptyState from '../common/EmptyState';
import Skeleton from '../common/Skeleton';
import './issue.css';

const IssueList = ({ repoId }) => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                // Assuming api.issue.getFromRepo logic is what we want, or generic get
                // Based on previous step, api.issue.getFromRepo(repoId) exists
                const res = await api.issue.getFromRepo(repoId);
                setIssues(res.data);
            } catch (err) {
                console.error("Error fetching issues", err);
            } finally {
                setLoading(false);
            }
        };

        fetchIssues();
    }, [repoId]);

    if (loading) return (
        <div className="issue-list">
            {[1, 2, 3].map(i => (
                <Skeleton key={i} width="100%" height="60px" style={{ marginBottom: '10px' }} />
            ))}
        </div>
    );

    return (
        <div className="issue-list">
            {issues.length === 0 ? (
                <EmptyState
                    icon="🐞"
                    title="No Issues found"
                    description="Everything seems bug-free! Or maybe no one has reported anything yet."
                />
            ) : (
                issues.map(issue => (
                    <div key={issue._id} className="issue-item">
                        <div className={`issue-icon ${issue.status}`}>
                            {issue.status === 'open' ? <FaExclamationCircle /> : <FaCheckCircle />}
                        </div>
                        <div className="issue-content">
                            <Link to={`/repo/${repoId}/issues/${issue._id}`} className="issue-title">
                                {issue.title}
                            </Link>
                            <div className="issue-meta">
                                #{issue._id.slice(-4)} opened by {typeof issue.owner === 'object' ? issue.owner.username : 'User'}
                                {' • '} {new Date(issue.createdAt || Date.now()).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default IssueList;
