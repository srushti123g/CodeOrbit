import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaArrowRight, FaHome, FaBox, FaExclamationCircle } from 'react-icons/fa';
import './CommandPalette.css';

const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    const actions = [
        { id: 'home', label: 'Go to Dashboard', icon: <FaHome />, action: () => navigate('/') },
        { id: 'repos', label: 'My Repositories', icon: <FaBox />, action: () => navigate('/repositories') },
        { id: 'issues', label: 'View Issues', icon: <FaExclamationCircle />, action: () => navigate('/issues') },
        { id: 'new-repo', label: 'Create New Repository', icon: <FaBox />, action: () => navigate('/create-repo') },
        { id: 'settings', label: 'Settings', icon: <FaArrowRight />, action: () => navigate('/settings') },
    ];

    const filteredActions = actions.filter(action =>
        action.label.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (index) => {
        const action = filteredActions[index];
        if (action) {
            action.action();
            setIsOpen(false);
            setQuery("");
        }
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredActions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            handleSelect(selectedIndex);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="command-palette-overlay" onClick={() => setIsOpen(false)}>
            <div className="command-palette-modal" onClick={e => e.stopPropagation()}>
                <div className="cp-header">
                    <FaSearch className="cp-search-icon" />
                    <input
                        ref={inputRef}
                        type="text"
                        className="cp-input"
                        placeholder="Type a command or search..."
                        value={query}
                        onChange={e => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        onKeyDown={handleInputKeyDown}
                    />
                    <span className="cp-badge">ESC</span>
                </div>
                <div className="cp-results">
                    {filteredActions.length > 0 ? (
                        filteredActions.map((action, index) => (
                            <div
                                key={action.id}
                                className={`cp-item ${index === selectedIndex ? 'active' : ''}`}
                                onClick={() => handleSelect(index)}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <span className="cp-item-icon">{action.icon}</span>
                                <span className="cp-item-label">{action.label}</span>
                                {index === selectedIndex && <FaArrowRight className="cp-enter-icon" />}
                            </div>
                        ))
                    ) : (
                        <div className="cp-empty">No results found.</div>
                    )}
                </div>
                <div className="cp-footer">
                    <span>Use <strong>↑↓</strong> to navigate</span>
                    <span><strong>Enter</strong> to select</span>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
