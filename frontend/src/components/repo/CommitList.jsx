import React from "react";
import "./repoDetail.css";

const CommitList = ({ commits }) => {
    if (!commits || commits.length === 0) {
        return <div className="no-commits">No commits yet.</div>;
    }

    return (
        <div className="commit-list">
            {commits.map((commit) => (
                <div key={commit._id} className="commit-item">
                    <div className="commit-header">
                        <span className="commit-message">{commit.message}</span>
                        <span className="commit-hash">{commit._id.substring(0, 7)}</span>
                    </div>
                    <div className="commit-meta">
                        <span className="commit-author-avatar">👤</span>
                        <span className="commit-author">{commit.author?.username || "Unknown"}</span>
                        <span>committed on {new Date(commit.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CommitList;
