import React from 'react';
import './dashboard.css';

const ContributionChart = () => {
    // Generate mock data for a 12-month calendar grid
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

    // Create a 52x7 grid (approx)
    const weeks = Array.from({ length: 53 }, () =>
        Array.from({ length: 7 }, () => Math.floor(Math.random() * 5))
    );

    const getLevelColor = (level) => {
        switch (level) {
            case 0: return 'var(--bg-subtle)';
            case 1: return '#d1fae5'; // Emerald 100
            case 2: return '#34d399'; // Emerald 400
            case 3: return '#10b981'; // Emerald 500
            case 4: return '#065f46'; // Emerald 800
            default: return 'var(--bg-subtle)';
        }
    };

    return (
        <div className="contribution-heatmap-container">
            <div className="heatmap-header">
                <h4 className="heatmap-title">Contribution Activity</h4>
                <div className="heatmap-legend">
                    <span>Less</span>
                    {[0, 1, 2, 3, 4].map(l => (
                        <div key={l} className="legend-swatch" style={{ background: getLevelColor(l) }} />
                    ))}
                    <span>More</span>
                </div>
            </div>

            <div className="heatmap-scroll-container">
                <div className="heatmap-grid-wrapper">
                    {/* Days Column */}
                    <div className="days-column">
                        {days.map((day, i) => (
                            <span key={i} className="day-label">{day}</span>
                        ))}
                    </div>

                    {/* Weeks Grid */}
                    <div className="weeks-container">
                        {weeks.map((week, wi) => (
                            <div key={wi} className="heatmap-week">
                                {wi % 4 === 0 && <span className="month-label">{months[Math.floor(wi / 4.4) % 12]}</span>}
                                {week.map((level, di) => (
                                    <div
                                        key={di}
                                        className="heatmap-cell"
                                        style={{ background: getLevelColor(level) }}
                                        title={`${level * 3} contributions`}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContributionChart;
