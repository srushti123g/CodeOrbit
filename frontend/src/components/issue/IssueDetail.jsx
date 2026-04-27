import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import api from '../../services/api';
import './issue.css';

const IssueDetail = () => {
    const { id, issueId } = useParams(); // Start with RepoID from URL, issueId from nested route? 
    // Wait, the route structure in App/Routes needs to support this. 
    // /repo/:id/issues/:issueId

    // NOTE: I need to update Routes.jsx to include this route! 
    // Assuming route: /repo/:id/issues/:issueId

    const [issue, setIssue] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Use issueId from params
    const activeIssueId = issueId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const issueRes = await api.get(`/issue/${activeIssueId}`);
                setIssue(issueRes.data);

                const commentsRes = await api.get(`/issue/${activeIssueId}/comments`);
                setComments(commentsRes.data);
            } catch (err) {
                console.error("Failed to load issue", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeIssueId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const res = await api.post(`/issue/${activeIssueId}/comments`, { content: newComment });
            setComments([...comments, res.data]); // Optimistic update or use response
            // Actually response returns the new comment. But it needs populated user for UI?
            // The controller returns the comment. User field is ObjectId.
            // We might need to refresh or manual populate.
            // For now, let's just refresh list or do simple Append.
            // A simple refresh is safer to get populated user.
            const commentsRes = await api.get(`/issue/${activeIssueId}/comments`);
            setComments(commentsRes.data);
            setNewComment("");
        } catch (err) {
            console.error("Failed to post comment", err);
        }
    };

    const toggleStatus = async () => {
        try {
            const newStatus = issue.status === 'open' ? 'closed' : 'open';
            const res = await api.put(`/issue/${activeIssueId}/status`, { status: newStatus });
            setIssue(res.data);
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    if (loading) return <div className="loading-container">Loading...</div>;
    if (!issue) return <div className="error-container">Issue not found</div>;

    return (
        <div className="issue-detail-container">
            <div className="issue-detail-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h1 className="issue-detail-title">
                        {issue.title} <span style={{ color: '#888', fontWeight: 300 }}>#{issue._id.slice(-4)}</span>
                    </h1>
                    <button className="btn-secondary" onClick={() => navigate(`/repo/${id}`)}>Back to Repo</button>
                </div>

                <div className="issue-meta-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                    <div className={`issue-status-badge ${issue.status}`}>
                        {issue.status === 'open' ? <FaExclamationCircle /> : <FaCheckCircle />}
                        {issue.status === 'open' ? 'Open' : 'Closed'}
                    </div>
                    <span style={{ color: 'var(--text-secondary)' }}>
                        opened this issue on {new Date(issue.createdAt || Date.now()).toLocaleDateString()} · {comments.length} comments
                    </span>
                </div>
            </div>

            <div className="comment-list">
                {/* Original Description as first comment-like item */}
                <div className="comment-item">
                    <div className="comment-header">
                        <span className="comment-author">Original Description</span>
                    </div>
                    <div className="comment-body">
                        {issue.description || <i>No description provided.</i>}
                    </div>
                </div>

                {comments.map(comment => (
                    <div key={comment._id} className="comment-item">
                        <div className="comment-header">
                            <span className="comment-author">{comment.user?.username || 'User'}</span>
                            <span>commented on {new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="comment-body">
                            {comment.content}
                        </div>
                    </div>
                ))}
            </div>

            <form className="comment-form" onSubmit={handleCommentSubmit}>
                <textarea
                    className="comment-textarea"
                    placeholder="Leave a comment"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button type="button" className="btn-secondary" onClick={toggleStatus}>
                        {issue.status === 'open' ? 'Close Issue' : 'Reopen Issue'}
                    </button>
                    <button type="submit" className="comment-submit" disabled={!newComment.trim()}>
                        Comment
                    </button>
                </div>
            </form>
        </div>
    );
};

export default IssueDetail;
