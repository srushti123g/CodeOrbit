import React, { useState, useEffect } from "react";
import Markdown from "react-markdown";
import api from "../../services/api";
import "./repoWiki.css";

const RepoWiki = ({ repoId, isOwner }) => {
    const [pages, setPages] = useState([]);
    const [activePage, setActivePage] = useState(null); // Full page object
    const [content, setContent] = useState(""); // For editing
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPages();
    }, [repoId]);

    const fetchPages = async () => {
        try {
            const res = await api.wiki.getAll(repoId);
            setPages(res.data);
            if (res.data.length > 0 && !activePage) {
                // Load first page by default if none selected
                handlePageClick(res.data[0].slug);
            } else if (res.data.length === 0) {
                // No pages, show create mode if owner, or empty state
                setLoading(false);
            }
        } catch (err) {
            console.error("Error fetching wiki pages:", err);
            setLoading(false);
        }
    };

    const handlePageClick = async (slug) => {
        setIsEditing(false);
        setIsCreating(false);
        setLoading(true);
        try {
            const res = await api.wiki.getBySlug(repoId, slug);
            setActivePage(res.data);
            setContent(res.data.content);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching page:", err);
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.wiki.create(repoId, { title: newTitle, content });
            setNewTitle("");
            setContent("");
            setIsCreating(false);
            fetchPages(); // Refresh list
        } catch (err) {
            console.error("Error creating page:", err);
            alert("Failed to create page");
        }
    };

    const handleUpdate = async () => {
        if (!activePage) return;
        try {
            const res = await api.wiki.update(repoId, activePage.slug, { content });
            setActivePage(res.data);
            setIsEditing(false);
            alert("Page updated!");
        } catch (err) {
            console.error("Error updating page:", err);
            alert("Failed to update page");
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this page?")) return;
        try {
            await api.wiki.delete(repoId, activePage.slug);
            setActivePage(null);
            fetchPages();
        } catch (err) {
            console.error("Error deleting page:", err);
            alert("Failed to delete page");
        }
    };

    const renderSidebar = () => (
        <div className="wiki-sidebar">
            <div className="wiki-sidebar-header">
                <h3>Pages</h3>
            </div>
            <ul className="wiki-page-list">
                {pages.map((page) => (
                    <li
                        key={page.slug}
                        className={activePage?.slug === page.slug ? "active" : ""}
                        onClick={() => handlePageClick(page.slug)}
                    >
                        {page.title}
                    </li>
                ))}
            </ul>
            {isOwner && (
                <button
                    className="btn-new-page"
                    onClick={() => {
                        setIsCreating(true);
                        setIsEditing(false);
                        setContent("");
                        setNewTitle("");
                        setActivePage(null);
                    }}
                >
                    + New Page
                </button>
            )}
        </div>
    );

    const renderContent = () => {
        if (loading) return <div className="wiki-content">Loading...</div>;

        if (isCreating) {
            return (
                <div className="wiki-content">
                    <h2>Create New Page</h2>
                    <form onSubmit={handleCreate}>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                className="form-input"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="e.g. Home, Installation, API Docs"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Content (Markdown)</label>
                            <textarea
                                className="form-input wiki-editor"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="# Heading\n\nWrite your documentation here..."
                                required
                            />
                        </div>
                        <div className="wiki-actions">
                            <button type="button" className="btn-secondary" onClick={() => setIsCreating(false)}>Cancel</button>
                            <button type="submit" className="btn-primary">Create Page</button>
                        </div>
                    </form>
                </div>
            );
        }

        if (isEditing && activePage) {
            return (
                <div className="wiki-content">
                    <div className="wiki-header">
                        <h2>Editing: {activePage.title}</h2>
                    </div>
                    <div className="form-group">
                        <textarea
                            className="form-input wiki-editor"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <div className="wiki-actions">
                        <button className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                        <button className="btn-primary" onClick={handleUpdate}>Save Changes</button>
                    </div>
                </div>
            );
        }

        if (activePage) {
            return (
                <div className="wiki-content">
                    <div className="wiki-header">
                        <h2>{activePage.title}</h2>
                        {isOwner && (
                            <div className="wiki-controls">
                                <button className="btn-secondary" onClick={() => setIsEditing(true)}>Edit</button>
                                <button className="btn-danger" onClick={handleDelete}>Delete</button>
                            </div>
                        )}
                    </div>
                    <div className="markdown-body">
                        <Markdown>{activePage.content}</Markdown>
                    </div>
                    <div className="wiki-footer">
                        Last updated on {new Date(activePage.updatedAt).toLocaleDateString()}
                    </div>
                </div>
            );
        }

        return (
            <div className="wiki-content empty-wiki">
                <h3>Welcome to the Wiki</h3>
                <p>Select a page from the sidebar to view detailed documentation.</p>
                {pages.length === 0 && isOwner && (
                    <p>You haven't created any pages yet. Click "New Page" to get started.</p>
                )}
            </div>
        );
    };

    return (
        <div className="repo-wiki-container">
            {renderSidebar()}
            {renderContent()}
        </div>
    );
};

export default RepoWiki;
