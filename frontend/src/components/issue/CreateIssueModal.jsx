import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import api from '../../services/api';

const CreateIssueModal = ({ repoId, onClose, onIssueCreated }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        try {
            const res = await api.issue.create(repoId, { title, description });
            onIssueCreated(res.data);
            onClose();
        } catch (err) {
            console.error("Failed to create issue", err);
        } finally {
            setLoading(false);
        }
    };

    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 className="modal-title">New Issue</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Title"
                            required
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Leave a comment"
                            rows={5}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-create" disabled={loading}>
                            {loading ? "Creating..." : "Submit new issue"}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default CreateIssueModal;
