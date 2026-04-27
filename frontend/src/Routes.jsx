import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./authContext";
import Layout from "./components/layout/Layout";

// Lazy Load Components
const Dashboard = lazy(() => import("./components/dashboard/Dashboard"));
const Login = lazy(() => import("./components/auth/Login"));
const Signup = lazy(() => import("./components/auth/Signup"));
const RepoDetail = lazy(() => import("./components/repo/RepoDetail"));
const CreateRepoModal = lazy(() => import("./components/repo/CreateRepoModal"));
const Profile = lazy(() => import("./components/user/Profile"));
const IssueDetail = lazy(() => import("./components/issue/IssueDetail"));
const MyRepositories = lazy(() => import("./components/dashboard/MyRepositories"));
const Issues = lazy(() => import("./components/dashboard/Issues"));
const Activity = lazy(() => import("./components/dashboard/Activity"));
const Settings = lazy(() => import("./components/user/Settings"));
const LandingPage = lazy(() => import("./components/landing/LandingPage"));

// Loading Fallback
const LoadingSpinner = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
);

const ProjectRoutes = () => {
    const { currentUser, loading } = useAuth();

    if (loading) return <LoadingSpinner />;

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                {/* Public Routes */}
                <Route path="/register" element={<Signup />} />
                <Route path="/login" element={<Login />} />

                {/* Protected Routes wrapped in Layout */}
                <Route element={<Layout />}>
                    <Route path="/" element={currentUser ? <Dashboard /> : <LandingPage />} />
                    <Route path="/repo/:id" element={<RepoDetail />} />
                    <Route path="/repo/:id/issues/:issueId" element={<IssueDetail />} />
                    <Route path="/create-repo" element={<CreateRepoModal />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/:id" element={<Profile />} />

                    {/* Dashboard Navigation Routes */}
                    <Route path="/repositories" element={<MyRepositories />} />
                    <Route path="/issues" element={<Issues />} />
                    <Route path="/activity" element={<Activity />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
            </Routes>
        </Suspense>
    );
};

export default ProjectRoutes;