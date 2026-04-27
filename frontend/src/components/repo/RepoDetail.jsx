import React, { useState, useEffect, Suspense, lazy } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./repoDetail.css";
import CommitList from "./CommitList";
import SetupInstructions from "./SetupInstructions";
import IssueList from "../issue/IssueList";
import CreateIssueModal from "../issue/CreateIssueModal";
import CollaboratorsManager from "./CollaboratorsManager";
import CreatePRModal from "./CreatePRModal";
import api from "../../services/api";
import RepoDetailSkeleton from "./RepoDetailSkeleton";

// Lazy Load Heavy Components
const RepoAnalytics = lazy(() => import("./RepoAnalytics"));
const RepoPullRequests = lazy(() => import("./RepoPullRequests"));
const RepoWiki = lazy(() => import("./RepoWiki"));
const KanbanBoard = lazy(() => import("./KanbanBoard"));

const RepoDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [repo, setRepo] = useState(null);
    const [commits, setCommits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("code"); // 'code', 'issues', 'commits', 'settings', 'analytics', 'pull-requests', 'wiki'
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContent, setFileContent] = useState("");
    const [fetchingFile, setFetchingFile] = useState(false);
    const [showCreateIssueModal, setShowCreateIssueModal] = useState(false);
    const [showCreatePRModal, setShowCreatePRModal] = useState(false);

    // Helper to determine ownership
    const currentUserId = localStorage.getItem("userId");
    const isOwner = repo && (typeof repo.owner === 'object' ? repo.owner._id : repo.owner) === currentUserId;


    const handleFileClick = async (file) => {
        const fileName = typeof file === 'string' ? file : file?.name;
        setSelectedFile(fileName);
        setFetchingFile(true);
        setFileContent(""); // Clear previous content

        try {
            if (commits.length > 0) {
                const commitId = commits[0]._id;
                const res = await api.commit.getFile(commitId, fileName);
                setFileContent(res.data);
            }
        } catch (err) {
            console.error("Failed to fetch file content", err);
            setFileContent("Error loading file content.");
        } finally {
            setFetchingFile(false);
        }
    };

    const handleDeleteFile = async (e, fileName) => {
        e.stopPropagation();
        if (!window.confirm(`Are you sure you want to delete ${fileName}?`)) return;

        try {
            const currentUserId = localStorage.getItem("userId");
            await api.commit.deleteFile({
                repoId: id,
                userId: currentUserId,
                fileName: fileName
            });
            // Refresh data
            const commitsRes = await api.commit.getByRepo(id);
            setCommits(commitsRes.data);
            alert("File deleted successfully!");
        } catch (err) {
            console.error("Failed to delete file", err);
            alert("Failed to delete file.");
        }
    };



    const handleBackToFiles = () => {
        setSelectedFile(null);
        setFileContent("");
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const repoRes = await api.repo.getById(id);
                const repoData = Array.isArray(repoRes.data) ? repoRes.data[0] : repoRes.data;
                setRepo(repoData);

                const commitsRes = await api.commit.getByRepo(id);
                console.log("RepoDetail: Commits fetched:", commitsRes.data);
                if (commitsRes.data.length > 0) {
                    console.log("RepoDetail: Latest commit files:", commitsRes.data[0].files);
                }
                setCommits(commitsRes.data);
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <RepoDetailSkeleton />;
    if (!repo) return <div className="error">Repository not found.</div>;

    return (
        <div className="dashboard-content-elite animate-fade-up">
            <div className="repo-detail-container">
                <div className="repo-header">
                    <div className="repo-title-group">
                        <div className="repo-breadcrumb">
                            <span className="repo-owner-name">{repo.owner?.username || "owner"}</span>
                            <span className="separator">/</span>
                            <h1 className="repo-name">{repo.name}</h1>
                            <span className={`visibility-badge ${repo.visibility ? 'public' : 'private'}`}>
                                {repo.visibility ? "Public" : "Private"}
                            </span>
                        </div>
                    </div>

                    <div className="repo-actions-toolbar">
                        <div className="branch-selector">
                            <span className="branch-icon">⑂</span>
                            <span className="current-branch">main</span>
                            <span className="dropdown-arrow">▼</span>
                        </div>

                        <div className="action-buttons">
                            <button className="btn-action">
                                <span className="action-icon">⭐</span> Star
                            </button>
                            <button className="btn-action">
                                <span className="action-icon">⑂</span> Fork
                            </button>
                            {isOwner && (
                                <button className="btn-action primary" onClick={() => setActiveTab("settings")}>
                                    ⚙ Settings
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="repo-tabs">
                    <button
                        className={`tab ${activeTab === "code" ? "active" : ""}`}
                        onClick={() => setActiveTab("code")}
                    >
                        <span className="tab-icon">DATA</span> Code
                    </button>
                    <button
                        className={`tab ${activeTab === "issues" ? "active" : ""}`}
                        onClick={() => setActiveTab("issues")}
                    >
                        Issues <span className="tab-count">{repo.issues?.length || 0}</span>
                    </button>
                    <button
                        className={`tab ${activeTab === "board" ? "active" : ""}`}
                        onClick={() => setActiveTab("board")}
                    >
                        Board
                    </button>
                    <button
                        className={`tab ${activeTab === "pull-requests" ? "active" : ""}`}
                        onClick={() => setActiveTab("pull-requests")}
                    >
                        Pull Requests
                    </button>
                    <button
                        className={`tab ${activeTab === "wiki" ? "active" : ""}`}
                        onClick={() => setActiveTab("wiki")}
                    >
                        Wiki
                    </button>
                    <button
                        className={`tab ${activeTab === "commits" ? "active" : ""}`}
                        onClick={() => setActiveTab("commits")}
                    >
                        Commits <span className="tab-count">{commits.length}</span>
                    </button>
                    <button
                        className={`tab ${activeTab === "settings" ? "active" : ""}`}
                        onClick={() => setActiveTab("settings")}
                    >
                        Settings
                    </button>
                    <button
                        className={`tab ${activeTab === "analytics" ? "active" : ""}`}
                        onClick={() => setActiveTab("analytics")}
                    >
                        Analytics
                    </button>
                </div>

                <div className="repo-content">
                    {activeTab === "code" && (
                        <div className="code-view">
                            <div className="repo-description-card">
                                <p>{repo.description || "No description provided."}</p>
                                <div className="repo-meta-row">
                                    <span>JavaScript</span>
                                    <span>Updated 2 days ago</span>
                                </div>
                            </div>

                            <div className="file-browser">
                                {/* GitHub-style Latest Commit Bar */}
                                {commits.length > 0 && (
                                    <div className="latest-commit-bar">
                                        <div className="lcb-user">
                                            <span className="user-avatar-text">👤</span>
                                            <strong>{commits[0].author?.username || "User"}</strong>
                                            <span className="lcb-message">{commits[0].message}</span>
                                        </div>
                                        <div className="lcb-meta">
                                            <span className="commit-hash">{commits[0]._id.substring(0, 7)}</span>
                                            <span>•</span>
                                            <span>{new Date(commits[0].date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="file-browser-header">
                                    <div className="fb-col-name">Name</div>
                                    <div className="fb-col-commit">Last commit message</div>
                                    <div className="fb-col-time">Date</div>
                                </div>

                                {selectedFile ? (
                                    <div className="file-viewer">
                                        <div className="file-viewer-header">
                                            <button className="back-to-files-btn" onClick={handleBackToFiles}>
                                                <span style={{ marginRight: '5px' }}>←</span> {selectedFile}
                                            </button>
                                            <div className="file-actions">
                                                <button className="btn-icon">Raw</button>
                                                <button className="btn-icon">Copy</button>
                                            </div>
                                        </div>
                                        <div className="file-viewer-content">
                                            {fetchingFile ? (
                                                <div className="loading-content">Loading content...</div>
                                            ) : (
                                                <pre><code>{fileContent}</code></pre>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="file-list-container">
                                        {commits.length > 0 && commits[0].files?.length > 0 ? (
                                            commits[0].files.map((file, index) => {
                                                const fileName = typeof file === 'string' ? file : file?.name || JSON.stringify(file);
                                                return (
                                                    <div key={index} className="file-row" onClick={() => handleFileClick(fileName)}>
                                                        <div className="fb-col-name">
                                                            <span className="file-icon">📄</span>
                                                            <span className="file-name">{fileName}</span>
                                                        </div>
                                                        <div className="fb-col-commit">
                                                            {commits[0].message}
                                                        </div>
                                                        <div className="fb-col-time">
                                                            {new Date(commits[0].createdAt || commits[0].date).toLocaleDateString()}
                                                        </div>
                                                        <div className="fb-col-actions">
                                                            <button
                                                                className="delete-icon-btn"
                                                                onClick={(e) => handleDeleteFile(e, fileName)}
                                                                title="Delete file"
                                                            >
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="empty-repo-state">
                                                <p>This repository is empty.</p>
                                                <SetupInstructions repo={repo} />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "commits" && (
                        <CommitList commits={commits} />
                    )}

                    {activeTab === "issues" && (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                                <button className="btn-primary" onClick={() => setShowCreateIssueModal(true)}>New Issue</button>
                            </div>
                            <IssueList repoId={id} />
                        </>
                    )}

                    {activeTab === "board" && (
                        <Suspense fallback={<div className="loading-content">Loading Board...</div>}>
                            <KanbanBoard repoId={id} />
                        </Suspense>
                    )}

                    {activeTab === "pull-requests" && (
                        <Suspense fallback={<div className="loading-content">Loading Pull Requests...</div>}>
                            <RepoPullRequests
                                repoId={id}
                                onCreatePrClick={() => setShowCreatePRModal(true)}
                            />
                        </Suspense>
                    )}

                    {activeTab === "wiki" && (
                        <Suspense fallback={<div className="loading-content">Loading Wiki...</div>}>
                            <RepoWiki repoId={id} isOwner={isOwner} />
                        </Suspense>
                    )}

                    {activeTab === "settings" && (
                        <div className="settings-view animate-fade-in">
                            {/* General Settings */}
                            <div className="settings-card">
                                <h3>General Settings</h3>
                                <div className="form-group">
                                    <label>Repository Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={repo.name}
                                        onChange={(e) => setRepo({ ...repo, name: e.target.value })}
                                    />
                                    {repo.name === "existing-repo-name" && (
                                        <span style={{ color: "var(--danger-color)", fontSize: "12px", marginTop: "4px", display: "block" }}>
                                            ❌ Repository name already taken
                                        </span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        className="form-input"
                                        value={repo.description || ""}
                                        onChange={(e) => setRepo({ ...repo, description: e.target.value })}
                                        rows={3}
                                    />
                                </div>
                            </div>

                            {/* Visiblity */}
                            <div className="settings-card">
                                <h3>Visibility</h3>
                                <div className="form-group">
                                    <div className="visibility-control">
                                        <span className={repo.visibility ? "active" : ""}>Public</span>
                                        <button
                                            className={`toggle-btn ${repo.visibility ? "on" : "off"}`}
                                            onClick={() => setRepo({ ...repo, visibility: !repo.visibility })}
                                        >
                                            <div className="toggle-thumb"></div>
                                        </button>
                                        <span className={!repo.visibility ? "active" : ""}>Private</span>
                                    </div>
                                    <p className="helper-text">
                                        {repo.visibility
                                            ? "Public repositories are visible to everyone on the internet."
                                            : "Private repositories are only visible to you and collaborators."}
                                    </p>
                                </div>
                            </div>

                            {/* Access Control (Mock) */}
                            <div className="settings-card">
                                <h3>Access Control</h3>
                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input type="checkbox" defaultChecked /> Require pull request reviews before merging
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input type="checkbox" /> Allow force pushes
                                    </label>
                                </div>
                            </div>

                            {/* Collaborators Management */}
                            <div className="settings-card">
                                <h3>Collaborators</h3>
                                <CollaboratorsManager repoId={id} isOwner={isOwner} />
                            </div>

                            {/* Audit Log (Premium Feature) */}
                            <div className="settings-card">
                                <h3>Audit Log</h3>
                                <div className="audit-log-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div className="audit-entry" style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                        <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>Changed visibility</span>
                                        <span>to Private</span>
                                        <span style={{ marginLeft: 'auto', opacity: 0.7 }}>2 hours ago</span>
                                    </div>
                                    <div className="audit-entry" style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                        <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>Renamed repository</span>
                                        <span>from "old-name"</span>
                                        <span style={{ marginLeft: 'auto', opacity: 0.7 }}>1 day ago</span>
                                    </div>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="danger-zone">
                                <h3>Danger Zone</h3>
                                <div className="danger-row">
                                    <div>
                                        <strong>Change visibility</strong>
                                        <p>This repository is currently {repo.visibility ? "Public" : "Private"}.</p>
                                    </div>
                                    <button className="btn-secondary" onClick={() => setRepo({ ...repo, visibility: !repo.visibility })}>
                                        Change visibility
                                    </button>
                                </div>
                                <div className="danger-row">
                                    <div>
                                        <strong>Transfer ownership</strong>
                                        <p>Transfer this repository to another user or organization.</p>
                                    </div>
                                    <button className="btn-secondary">Transfer</button>
                                </div>
                                <div className="danger-row">
                                    <div>
                                        <strong>Delete this repository</strong>
                                        <p>Once you delete a repository, there is no going back. Please be certain.</p>
                                    </div>
                                    <button className="btn-danger" onClick={async () => {
                                        if (window.confirm("Type 'DELETE' to confirm deletion of this repository.")) {
                                            try {
                                                await api.repo.delete(id);
                                                alert("Repository deleted.");
                                                navigate("/");
                                            } catch (err) {
                                                console.error(err);
                                                alert("Failed to delete repository.");
                                            }
                                        }
                                    }}>Delete this repository</button>
                                </div>
                            </div>

                            {/* Sticky Save Bar */}
                            <div className="sticky-save-bar">
                                <span style={{ marginRight: 'auto', color: 'var(--text-secondary)', fontSize: '14px' }}>
                                    Unsaved changes...
                                </span>
                                <button className="btn-secondary" onClick={() => window.location.reload()}>Reset</button>
                                <button className="btn-primary" onClick={async () => {
                                    try {
                                        await api.repo.update(id, {
                                            name: repo.name,
                                            description: repo.description,
                                            visibility: repo.visibility
                                        });
                                        alert("Settings saved successfully!");
                                    } catch (err) {
                                        console.error(err);
                                        alert("Failed to save settings.");
                                    }
                                }}>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === "analytics" && (
                        <Suspense fallback={<div className="loading-content">Loading Analytics...</div>}>
                            <RepoAnalytics commits={commits} />
                        </Suspense>
                    )}
                </div>

                {showCreateIssueModal && (
                    <CreateIssueModal
                        repoId={id}
                        onClose={() => setShowCreateIssueModal(false)}
                        onIssueCreated={() => {
                            window.location.reload(); // Simple refresh to see new issue
                        }}
                    />
                )}

                {showCreatePRModal && (
                    <CreatePRModal
                        repoId={id}
                        onClose={() => setShowCreatePRModal(false)}
                        onPrCreated={() => {
                            window.location.reload();
                        }}
                    />
                )}
            </div >
        </div>
    );
};

export default RepoDetail;
