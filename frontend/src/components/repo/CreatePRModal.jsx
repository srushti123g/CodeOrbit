import React, { useState } from "react";
import "./createRepoModal.css"; // Reuse modal styles
import api from "../../services/api";

const CreatePRModal = ({ repoId, onClose, onPrCreated }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [sourceBranch, setSourceBranch] = useState("");
    const [targetBranch, setTargetBranch] = useState("main");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.pr.create(repoId, { title, description, sourceBranch, targetBranch });
            onPrCreated();
            onClose();
        } catch (err) {
            console.error("Failed to create PR:", err);
            alert("Failed to create PR");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-scale-in" style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <h2>Create Pull Request</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            className="form-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="Title"
                        />
                    </div>
                    <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label>Source Branch</label>
                            <input
                                type="text"
                                className="form-input"
                                value={sourceBranch}
                                onChange={(e) => setSourceBranch(e.target.value)}
                                required
                                placeholder="feature-branch"
                            />
                        </div>
                        <div style={{ width: '40%' }}>
                            <label>Target Branch</label>
                            <input
                                type="text"
                                className="form-input"
                                value={targetBranch}
                                onChange={(e) => setTargetBranch(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            className="form-input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={5}
                            placeholder="Describe your changes..."
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Creating..." : "Create Pull Request"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePRModal;
