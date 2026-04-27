import React from "react";
import { Link } from "react-router-dom";

const ExploreSection = ({ suggested }) => {
  return (
    <div className="explore-section">
      <h2 className="section-title">Discover Projects</h2>

      <div className="explore-scroll">
        {suggested.slice(0, 6).map((repo) => (
          <Link to={`/repo/${repo._id}`} key={repo._id} className="explore-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h4>{repo.name}</h4>
            <p>{repo.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExploreSection;
