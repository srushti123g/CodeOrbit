import React, { useState, useEffect } from "react";
import "./dashboard.css";
import api from "../../services/api";

const ActivityInsights = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Fallback mock data if API fails or returns empty (for demo purposes)
        const mockData = [
          { _id: 1, user: { username: "You" }, description: "created repository 'ApnaUI'", timestamp: new Date().toISOString() },
          { _id: 2, user: { username: "You" }, description: "closed issue #12", timestamp: new Date(Date.now() - 3600000).toISOString() },
          { _id: 3, user: { username: "System" }, description: "merged PR #7 into main", timestamp: new Date(Date.now() - 7200000).toISOString() },
        ];

        if (api.activity && api.activity.getAll) {
          const response = await api.activity.getAll();
          const data = response.data;
          if (Array.isArray(data) && data.length > 0) {
            setActivities(data);
          } else {
            setActivities(mockData);
          }
        } else {
          setActivities(mockData);
        }
      } catch (err) {
        console.error("Failed to fetch activities", err);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="timeline-feed">
      {activities.length > 0 ? (
        activities.map((activity, index) => (
          <div key={activity._id} className="timeline-item">
            <div className="timeline-line"></div>
            <div className={`timeline-dot ${index === 0 ? 'pulse' : ''}`}></div>
            <div className="timeline-content">
              <p className="timeline-text">
                <span className="timeline-user">
                  {activity.user?.username ? activity.user.username : "User"}
                </span>
                {" "}
                {activity.description.replace(/^User /, '')}
                {/* Temp fix for redundant 'User' prefix if it exists in data */}
              </p>
              <span className="timeline-time">
                {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="empty-state" style={{ padding: '20px 0' }}>
          <p style={{ fontSize: '13px' }}>No recent activity.</p>
        </div>
      )}
    </div>
  );
};

export default ActivityInsights;
