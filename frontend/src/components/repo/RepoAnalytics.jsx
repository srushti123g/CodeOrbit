import React, { useState, useEffect } from 'react';
import ContributorHeatmap from './ContributorHeatmap';
import CommitActivityChart from './CommitActivityChart';
import api from "../../services/api";
import { useParams } from 'react-router-dom';
import "./repoDetail.css";

const RepoAnalytics = () => {
    const { id } = useParams();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.commit.getActivity(id);
                setStats(res.data);
            } catch (err) {
                console.error("Error fetching analytics:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [id]);

    if (loading) return <div className="loading">Loading analytics...</div>;
    if (!stats) return <div className="error">No analytics available.</div>;

    // stats = { heatmap: [], totalCommits: N, topContributors: [] }

    // Transform heatmap data for Recharts (Bar/Area) if needed, or use as is for Heatmap
    // CommitActivityChart expects [{ date, count }] sorted
    const chartData = stats.heatmap.sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className="analytics-view animate-fade-up">
            <div className="analytics-summary">
                <div className="stat-card">
                    <h3>Total Commits</h3>
                    <div className="stat-value">{stats.totalCommits}</div>
                </div>
                <div className="stat-card">
                    <h3>Contributors</h3>
                    <div className="stat-value">{stats.topContributors.length}</div>
                </div>
            </div>

            <ContributorHeatmap data={stats.heatmap} />

            <CommitActivityChart data={chartData} />

            <div className="settings-card">
                <h3>Top Contributors</h3>
                <div className="contributors-list">
                    {stats.topContributors.map((c, i) => (
                        <div key={i} className="contributor-row">
                            <span className="contributor-rank">#{i + 1}</span>
                            <span className="contributor-name">{c.name}</span>
                            <span className="contributor-count">{c.count} commits</span>
                        </div>
                    ))}
                    {stats.topContributors.length === 0 && <p className="helper-text">No contributors yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default RepoAnalytics;
