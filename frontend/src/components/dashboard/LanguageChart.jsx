import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import "./dashboard.css";

const LanguageChart = () => {
    // Mock data for now
    const data = [
        { name: "JavaScript", value: 45 },
        { name: "Python", value: 25 },
        { name: "HTML/CSS", value: 20 },
        { name: "Other", value: 10 },
    ];

    const COLORS = ["#8b5cf6", "#ec4899", "#3b82f6", "#64748b"];

    return (
        <div className="activity-card" style={{ height: "350px", marginTop: "24px", minHeight: "300px" }}>
            <h3 style={{ color: "var(--text-primary)", marginBottom: "20px" }}>Language Distribution</h3>
            <div style={{ width: "100%", height: "250px" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--glass-border)", color: "var(--text-primary)" }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default LanguageChart;
