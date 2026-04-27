import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./profile.css";
// Primer imports removed
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext.jsx";

import { useToast } from "../common/Toast"; // Import useToast
import api from "../../services/api";

import EditProfileModal from "./EditProfileModal";

const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState({ username: "username" });
  const [repositories, setRepositories] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // "overview", "repositories", "stars"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setCurrentUser } = useAuth();
  const { addToast } = useToast();

  const currentUserId = localStorage.getItem("userId");
  const profileUserId = id || currentUserId;
  const isOwnProfile = profileUserId === currentUserId;

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (profileUserId) {
        try {
          const response = await api.user.getProfile(profileUserId);
          setUserDetails(response.data);
        } catch (err) {
          console.error("Cannot fetch user details: ", err);
        }
      }
    };
    fetchUserDetails();
  }, [profileUserId]);

  useEffect(() => {
    if (activeTab === "repositories" && profileUserId) {
      const fetchUserRepos = async () => {
        setLoadingRepos(true);
        try {
          const res = await api.repo.getByUser(profileUserId);
          setRepositories(res.data.repositories || []);
        } catch (err) {
          console.error("Error fetching user repositories:", err);
          addToast("Failed to fetch repositories", "error");
        } finally {
          setLoadingRepos(false);
        }
      };
      fetchUserRepos();
    }
  }, [activeTab, profileUserId]);

  const handleSaveProfile = async (updatedData) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await api.user.updateProfile(userId, updatedData);
      setUserDetails(response.data);
      setIsModalOpen(false);
      addToast("Profile updated!", "success");
    } catch (err) {
      console.error("Failed to update profile", err);
      addToast("Failed to update profile", "error");
    }
  };

  return (
    <div className="profile-shell">
      <div className="profile-cover"></div>

      <div className="profile-layout container">
        <aside className="profile-sidebar">
          <div className="profile-card">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                {userDetails.username ? userDetails.username[0].toUpperCase() : 'U'}
              </div>
            </div>

            <div className="profile-identity">
              <h1 className="profile-name">{userDetails.username}</h1>
              <p className="profile-handle">@{userDetails.username.toLowerCase()}</p>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-count">{userDetails.followersCount || 0}</span>
                <span className="stat-label">followers</span>
              </div>
              <div className="stat-item">
                <span className="stat-count">{userDetails.followingCount || 0}</span>
                <span className="stat-label">following</span>
              </div>
            </div>

            {isOwnProfile && (
              <button
                className="btn-secondary full-width btn-edit-profile"
                onClick={() => setIsModalOpen(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </aside>

        <main className="profile-content">
          <div className="profile-nav">
            <button
              className={`nav-tab ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <span>Overview</span>
            </button>
            <button
              className={`nav-tab ${activeTab === "repositories" ? "active" : ""}`}
              onClick={() => setActiveTab("repositories")}
            >
              <span>Repositories</span>
            </button>
            <button
              className={`nav-tab ${activeTab === "stars" ? "active" : ""}`}
              onClick={() => setActiveTab("stars")}
            >
              <span>Stars</span>
            </button>
          </div>

          {activeTab === "overview" && (
            <div className="content-widget animate-fade-up">
              <h3 className="widget-title">Contribution Activity</h3>
              <div className="heatmap-container">
                <HeatMapProfile userId={profileUserId} />
              </div>
            </div>
          )}

          {activeTab === "repositories" && (
            <div className="repos-tab-content animate-fade-up">
              {loadingRepos ? (
                <div className="loading-repos">Loading repositories...</div>
              ) : repositories.length > 0 ? (
                <div className="profile-repos-grid">
                  {repositories.map(repo => (
                    <div key={repo._id} className="profile-repo-card" onClick={() => navigate(`/repo/${repo._id}`)}>
                      <div className="repo-card-header">
                        <span className="repo-card-icon">📁</span>
                        <h4 className="repo-card-name">{repo.name}</h4>
                        <span className={`visibility-badge-sm ${repo.visibility ? 'public' : 'private'}`}>
                          {repo.visibility ? "Public" : "Private"}
                        </span>
                      </div>
                      <p className="repo-card-desc">{repo.description || "No description provided."}</p>
                      <div className="repo-card-footer">
                        <span className="repo-lang-dot"></span>
                        <span className="repo-lang">JavaScript</span>
                        <span className="repo-stars">⭐ {repo.stars || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-profile-repos">
                  <p>This user hasn't created any public repositories yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "stars" && (
            <div className="content-widget animate-fade-up">
              <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "40px" }}>
                Stars feature is coming soon! ✨
              </p>
            </div>
          )}
        </main>
      </div>

      {isOwnProfile && (
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            setCurrentUser(null);
            window.location.href = "/login";
          }}
          className="floating-logout-btn"
          title="Logout"
        >
          Logout
        </button>
      )}

      {isModalOpen && (
        <EditProfileModal
          user={userDetails}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
};

export default Profile;