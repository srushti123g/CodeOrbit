import React from 'react';
import { FaPlus, FaExclamationCircle, FaUserPlus, FaCodeBranch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const QuickActions = () => {
    const navigate = useNavigate();

    const actions = [
        {
            icon: <FaPlus />,
            label: "New Repository",
            onClick: () => navigate('/create-repo'),
        },
        {
            icon: <FaExclamationCircle />,
            label: "Create Issue",
            onClick: () => navigate('/issues'),
        },
        {
            icon: <FaUserPlus />,
            label: "Invite Member",
            onClick: () => navigate('/settings'),
        },
        {
            icon: <FaCodeBranch />,
            label: "New Pull Request",
            onClick: () => navigate('/repositories'),
        }
    ];

    return (
        <section className="quick-actions-row">
            {actions.map((action, index) => (
                <button
                    key={index}
                    className="action-pill"
                    onClick={action.onClick}
                >
                    <span className="action-pill-icon">{action.icon}</span>
                    {action.label}
                </button>
            ))}
        </section>
    );
};

export default QuickActions;
