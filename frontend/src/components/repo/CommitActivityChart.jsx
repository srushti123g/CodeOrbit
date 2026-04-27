import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CommitActivityChart = ({ data }) => {
    // data: [{ date, count }] sorted
    return (
        <div className="analytics-card">
            <h3>Commit Trends</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#58a6ff" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#58a6ff" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#8b949e"
                            tickFormatter={(str) => {
                                const date = new Date(str);
                                return `${date.getMonth() + 1}/${date.getDate()}`;
                            }}
                        />
                        <YAxis stroke="#8b949e" allowDecimals={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d', color: '#c9d1d9' }}
                            itemStyle={{ color: '#58a6ff' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#58a6ff"
                            fillOpacity={1}
                            fill="url(#colorCount)"
                            name="Commits"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CommitActivityChart;
