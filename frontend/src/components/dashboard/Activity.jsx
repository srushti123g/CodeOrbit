import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "./dashboard.css";

const Activity = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                // Assuming api.activity.getAll exists as verified before
                const response = await api.activity.getAll();
                setActivities(response.data || []);
            } catch (err) {
                console.error("Failed to fetch activities", err);
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, []);

    if (loading) return <div className="loading-skeleton">Loading activity...</div>;

    return (
        <div className="dashboard-content-elite">
            <header className="page-header-elite">
                <h2 className="section-title">Global Activity</h2>
                <p className="section-subtitle">Real-time pulse of the CodeOrbit ecosystem</p>
            </header>

            <div className="activity-feed-unified">
                {activities.length === 0 ? (
                    <div className="empty-state-glass">
                        <p>No recent activity found.</p>
                    </div>
                ) : (
                    <div className="timeline-feed">
                        {activities.map((activity, index) => (
                            <div key={activity._id} className="timeline-item">
                                <div className="timeline-line"></div>
                                <div className={`timeline-dot ${index === 0 ? 'pulse' : ''}`}></div>
                                <div className="timeline-content">
                                    <p className="timeline-text">
                                        <span className="timeline-user">
                                            {activity.user?.username || "Unknown"}
                                        </span>
                                        {" "}{activity.description}
                                    </p>
                                    <span className="timeline-time">
                                        {new Date(activity.timestamp).toLocaleString([], {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Activity;
