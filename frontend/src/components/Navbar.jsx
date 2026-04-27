import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useAuth } from "../authContext";

import CreateRepoModal from "./repo/CreateRepoModal";

const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Left - Brand */}
      <div className="navbar-left">
        <Link to="/" className="brand">
          CodeOrbit
        </Link>
      </div>

      {/* Center - Search */}
      <div className="navbar-center">
        <input
          type="text"
          placeholder="Search projects..."
          className="nav-search"
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </div>

      {/* Right - Links + Avatar */}
      <div className="navbar-right">
        <button
          className="create-repo-btn"
          onClick={() => {
            console.log("Create Repo button clicked");
            setIsModalOpen(true);
          }}
          style={{
            marginRight: "15px",
            background: "var(--primary-color)",
            border: "none",
            color: "white",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          + Create
        </button>

        <Link to="/" className="nav-link">
          Dashboard
        </Link>

        <Link to="/profile" className="nav-link">
          Profile
        </Link>

        <div
          className="avatar"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          S
        </div>

        {dropdownOpen && (
          <div className="dropdown">
            <p onClick={() => navigate("/profile")}>My Profile</p>
            <p onClick={handleLogout}>Logout</p>
          </div>
        )}
      </div>

      {isModalOpen && <CreateRepoModal onClose={() => setIsModalOpen(false)} />}
    </nav>
  );
};

export default Navbar;
