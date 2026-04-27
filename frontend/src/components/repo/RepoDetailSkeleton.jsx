import React from 'react';
import Skeleton from '../common/Skeleton';
import './repoDetail.css';

const RepoDetailSkeleton = () => {
    return (
        <div className="repo-detail-container animate-fade-up">
            <div className="repo-header">
                <div className="repo-title-wrapper">
                    <Skeleton width="200px" height="32px" />
                    <Skeleton width="60px" height="20px" style={{ borderRadius: '12px', marginLeft: '10px' }} />
                </div>
                <div className="repo-actions">
                    <Skeleton width="80px" height="32px" />
                    <Skeleton width="80px" height="32px" />
                </div>
            </div>

            <div className="repo-tabs" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                    <Skeleton key={i} width="80px" height="24px" />
                ))}
            </div>

            <div className="repo-content">
                <div className="code-view">
                    <div className="repo-description-card">
                        <Skeleton width="60%" height="20px" style={{ marginBottom: '10px' }} />
                        <Skeleton width="40%" height="20px" />
                    </div>

                    <div className="file-browser" style={{ marginTop: '24px' }}>
                        <div className="latest-commit-bar">
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <Skeleton type="circle" width="20px" height="20px" />
                                <Skeleton width="100px" height="16px" />
                                <Skeleton width="200px" height="16px" />
                            </div>
                        </div>
                        <div className="file-list-container">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="file-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                                        <Skeleton width="16px" height="16px" />
                                        <Skeleton width="150px" height="16px" />
                                    </div>
                                    <Skeleton width="100px" height="16px" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RepoDetailSkeleton;
