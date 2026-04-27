import React, { useState, useEffect } from "react";
import "./dashboard.css";
import GreetingSection from "./GreetingSection";
import StatsCards from "./StatsCards";
import QuickActions from "./QuickActions";
import ProjectGrid from "./ProjectGrid";
import ActivityInsights from "./ActivityInsights";
import ContributionChart from "./ContributionChart";
import api from "../../services/api";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const fetchData = async () => {
      try {
        const repoRes = await api.repo.getAll();
        const repoData = repoRes.data;
        const myRepos = repoData.filter(repo => {
          const ownerId = typeof repo.owner === 'object' ? repo.owner._id : repo.owner;
          return ownerId === userId;
        }) || [];
        setRepositories(myRepos);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-container animate-fade-up">
      {/* 1. Main Content Left */}
      <main className="dashboard-main">

        {/* Top: Greeting & Actions */}
        <div className="dashboard-header animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <GreetingSection />
          <div style={{ marginTop: '8px' }}>
            <QuickActions />
          </div>
        </div>

        {/* Stats Row */}
        <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <StatsCards repositories={repositories} />
        </div>

        {/* Charts / Heatmap Area */}
        <div className="dashboard-charts animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <ContributionChart />
        </div>

        {/* Projects List */}
        <div className="projects-section animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="section-title">
            Active Projects
          </h3>
          <ProjectGrid repositories={repositories} loading={loading} />
        </div>
      </main>

      {/* 2. Right Sidebar */}
      <aside className="dashboard-right-panel animate-fade-up" style={{ animationDelay: '0.5s' }}>
        {/* Activity Feed */}
        <div className="side-panel">
          <div className="panel-header">
            <span className="panel-title">Pulse Feed</span>
          </div>
          <ActivityInsights />
        </div>

        {/* Recent PRs */}
        <div className="side-panel">
          <div className="panel-header">
            <span className="panel-title">Active Pull Requests</span>
          </div>
          <div className="pr-list-wrapper">
            {[
              { title: "Refactor Theme Engine", status: "Merged", time: "2h ago", color: "#10b981" },
              { title: "Elite Dashboard UI", status: "Review", time: "Now", color: "#6366f1" }
            ].map((pr, i) => (
              <div key={i} className="pr-item">
                <div className="pr-icon-wrapper" style={{ background: `${pr.color}15`, color: pr.color }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div className="pr-info">
                  <div className="pr-title">{pr.title}</div>
                  <div className="pr-meta">
                    <span className="pr-status" style={{ color: pr.color }}>{pr.status}</span>
                    <span className="pr-time">• {pr.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;
