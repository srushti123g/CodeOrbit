import React from "react";
import { FaFolder, FaStar, FaBug, FaCodeBranch } from 'react-icons/fa';

const StatsCards = ({ repositories }) => {
  const totalRepos = repositories.length;
  const totalStars = repositories.reduce(
    (acc, repo) => acc + (repo.stars || 0),
    0
  );

  const stats = [
    { label: "Projects", value: totalRepos, icon: <FaFolder />, type: "primary" },
    { label: "Total Stars", value: totalStars, icon: <FaStar />, type: "warning" },
    { label: "Active Issues", value: 3, icon: <FaBug />, type: "danger" },
    { label: "Commits", value: 128, icon: <FaCodeBranch />, type: "info" },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`metric-card ${stat.type}`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="metric-header">
            <span className="metric-label">{stat.label}</span>
            <div className="icon-circle">
              {stat.icon}
            </div>
          </div>
          <div className="metric-value">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
