import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./createRepoModal.css";
import api from "../../services/api";
import { useToast } from "../common/Toast";
import { useNavigate } from "react-router-dom";

const CreateRepoModal = ({ onClose }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState(true); // true = public
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();
    const navigate = useNavigate();

    console.log("CreateRepoModal rendered"); // Debug log

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            addToast("Repository name is required", "error");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name,
                description,
                visibility // true/false
            };

            await api.repo.create(payload);
            addToast("Repository created successfully!", "success");
            onClose();
            window.location.reload();
        } catch (err) {
            console.error("Failed to create repo", err);
            addToast("Failed to create repository", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            navigate(-1); // Go back if no onClose prop (route mode)
        }
    };

    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">Create New Repository</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Repository Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., awesome-project"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Short description of your project..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Visibility</label>
                        <select
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value === "true")}
                            style={{ cursor: "pointer" }}
                        >
                            <option value="true">Public</option>
                            <option value="false">Private</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={handleClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-create" disabled={loading}>
                            {loading ? "Creating..." : "Create Repository"}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default CreateRepoModal;
