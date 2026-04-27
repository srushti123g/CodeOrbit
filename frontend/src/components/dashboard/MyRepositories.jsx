import React, { useState, useEffect } from "react";
import api from "../../services/api";
import ProjectGrid from "./ProjectGrid";
import "./dashboard.css"; // Reuse dashboard styles

const MyRepositories = () => {
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const userId = localStorage.getItem("userId");
                const res = await api.repo.getByUser(userId);
                // repoController returns { message, repositories }
                setRepositories(res.data.repositories || []);
            } catch (err) {
                console.error("Error fetching repositories:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRepos();
    }, []);

    const filteredRepos = repositories.filter(repo =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="dashboard-content">
            <div className="projects-header">
                <h2 className="section-title">My Repositories</h2>
                <div className="projects-controls">
                    <input
                        type="text"
                        placeholder="Search repositories..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <ProjectGrid repositories={filteredRepos} loading={loading} />
        </div>
    );
};

export default MyRepositories;
