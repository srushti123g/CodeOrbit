import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaEllipsisH, FaCircle } from "react-icons/fa";

const ProjectCard = ({ repo }) => {
  const [isStarred, setIsStarred] = useState(false);
  const [starCount, setStarCount] = useState(repo.stars || 0);

  // Elite Standard: Refined Meta Data
  const updatedTime = "2d ago";
  const languageColor = repo.language === "JavaScript" ? "#f1e05a" : "#4f46e5";

  // Elite Contributor Aesthetics
  const contributors = [
    { id: 1, color: "#6366f1", label: "JD" },
    { id: 2, color: "#f43f5e", label: "AS" },
    { id: 3, color: "#10b981", label: "MK" },
  ];

  return (
    <div className="project-card hover-lift">
      <div className="project-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="project-title-wrapper">
          <Link to={`/repo/${repo._id}`} className="project-name">
            {repo.name}
          </Link>
          <div className="project-badge">
            <FaCircle style={{ fontSize: '8px', color: repo.visibility ? 'var(--success)' : 'var(--text-muted)' }} />
            {repo.visibility ? "Public" : "Private"}
          </div>
        </div>
        <button className="icon-btn-ghost" title="Options">
          <FaEllipsisH />
        </button>
      </div>

      <p className="project-desc">
        {repo.description || "Building future-ready source control solutions with high-fidelity architecture and focus on scale."}
      </p>

      <div className="project-footer">
        <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600' }}>
          <div className="language-dot" style={{ width: '10px', height: '10px', borderRadius: '50%', background: languageColor }} />
          <span>{repo.language || 'Plain Text'}</span>
        </div>

        {/* Contributor Face-pile: Elite Design */}
        <div className="contributor-stack">
          {contributors.map((c, i) => (
            <div
              key={c.id}
              title={`Contributor: ${c.label}`}
              className="contributor-avatar"
              style={{
                background: c.color,
                marginLeft: i > 0 ? '-10px' : '0',
                zIndex: contributors.length - i,
              }}
            >
              {c.label}
            </div>
          ))}
        </div>

        <div className="meta-item star-action"
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', color: isStarred ? 'var(--warning)' : 'var(--text-secondary)' }}
          onClick={(e) => { e.preventDefault(); setIsStarred(!isStarred); }}>
          <FaStar />
          <span>{starCount + (isStarred ? 1 : 0)}</span>
        </div>
      </div>
    </div >
  );
};

export default ProjectCard;
