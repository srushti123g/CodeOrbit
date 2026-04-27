import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './Layout.css';

import CommandPalette from '../common/CommandPalette';
import { useAuth } from '../../authContext';

const Layout = () => {
    const { currentUser } = useAuth();
    const location = useLocation();

    // Check if we are on the root path ('/') AND the user is NOT logged in.
    // If so, we are on the Landing Page and should render only the Outlet (no sidebar/topbar).
    // If the user IS logged in, '/' renders the Dashboard, so we DO want the sidebar/topbar.
    const isLandingPage = location.pathname === '/' && !currentUser;

    if (isLandingPage) {
        return <Outlet />;
    }

    return (
        <div className="app-layout">
            <CommandPalette />
            <Sidebar />
            <main className="main-content">
                <Topbar />
                <div className="content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
