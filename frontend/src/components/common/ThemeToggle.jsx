import React, { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

const ThemeToggle = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <button
            onClick={toggleTheme}
            className="nav-item theme-toggle-btn"
            style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '10px' }}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? <FaMoon className="nav-icon" /> : <FaSun className="nav-icon" />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
    );
};

export default ThemeToggle;
