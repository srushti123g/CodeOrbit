import React from 'react';
import HeatMap from '@uiw/react-heat-map';
import Tooltip from '@uiw/react-tooltip';

const ContributorHeatmap = ({ data }) => {
    // data is array of { date: 'YYYY-MM-DD', count: N, level: 0-4 }

    return (
        <div className="analytics-card">
            <h3>Contribution Activity</h3>
            <div style={{ width: '100%', overflowX: 'auto' }}>
                <HeatMap
                    value={data}
                    width={850}
                    style={{ color: '#adbac7' }}
                    startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                    endDate={new Date()}
                    panelColors={{
                        0: '#161b22',
                        2: '#0e4429',
                        4: '#006d32',
                        10: '#26a641',
                        20: '#39d353',
                    }}
                    rectSize={14}
                    legendCellSize={0}
                    rectProps={{
                        rx: 2.5
                    }}
                    render={(props) => {
                        const { "data-index": index, "data-row": row, "data-column": col, ...rest } = props;
                        // const dataItem = data.find(d => d.date === rest['data-date']); // Optimization needed if large data
                        // For now relying on tooltip
                        return (
                            <Tooltip placement="top" content={`Commits on ${rest.date || 'this day'}: ${rest.count || 0}`}>
                                <rect {...props} />
                            </Tooltip>
                        );
                    }}
                />
            </div>
        </div>
    );
};

export default ContributorHeatmap;
