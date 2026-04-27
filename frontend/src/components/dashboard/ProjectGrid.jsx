import React from "react";
import ProjectCard from "./ProjectCard";
import Skeleton from "../common/Skeleton";
import { FaFolder } from "react-icons/fa";

const ProjectGrid = ({ repositories, loading }) => {
  if (loading) {
    return (
      <div className="project-grid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="project-card" style={{ height: "200px" }}>
            <Skeleton width="60%" height="24px" style={{ marginBottom: "12px" }} />
            <Skeleton width="100%" height="60px" style={{ marginBottom: "20px" }} />
            <Skeleton width="30%" height="16px" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {repositories.length > 0 ? (
        <div className="project-grid animate-fade-up delay-300">
          {repositories.map((repo) => (
            <ProjectCard key={repo._id} repo={repo} />
          ))}
        </div>
      ) : (
        <div className="empty-state animate-fade-up">
          <div className="empty-state-icon">
            <FaFolder />
          </div>
          <h3>No projects found</h3>
          <p>Create your first repository to get started.</p>
          <button className="primary-btn">Create Repository</button>
        </div>
      )}
    </>
  );
};

export default ProjectGrid;
