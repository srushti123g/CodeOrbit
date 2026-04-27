import React from 'react';
import './emptyState.css';

const EmptyState = ({ icon, title, description, children }) => {
    return (
        <div className="empty-state-container animate-fade-up">
            <div className="empty-state-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
            {children}
        </div>
    );
};

export default EmptyState;
