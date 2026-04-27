import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Code2,
    GitBranch,
    GitPullRequest,
    Terminal,
    Shield,
    Users,
    Zap,
    Layout,
    Globe,
    ChevronRight,
    Github,
    Twitter,
    Linkedin
} from 'lucide-react';
import { useTheme } from '../../ThemeContext';
import './landing.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="landing-container">
            {/* Background Decorations */}
            <div className="landing-bg-grid"></div>
            <div className="landing-glow glow-top"></div>

            {/* Navbar */}
            <nav className="landing-nav">
                <div className="landing-logo">
                    <div className="logo-icon-lg">
                        <Code2 size={24} />
                    </div>
                    <span>CodeOrbit</span>
                </div>

                <div className="nav-links">
                    <a href="#features" className="nav-link">Features</a>
                </div>

                <div className="nav-actions">
                    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
                        {theme === 'dark' ? '🌙' : '☀️'}
                    </button>
                    <Link to="/login" className="btn-text">Sign In</Link>
                    <Link to="/register" className="btn-primary-sm">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-section">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="hero-content"
                >


                    <motion.h1 variants={fadeInUp} className="hero-title">
                        Build. Collaborate. <br />
                        <span className="text-gradient">Ship Faster.</span>
                    </motion.h1>

                    <motion.p variants={fadeInUp} className="hero-subtitle">
                        CodeOrbit brings version control, issue tracking, pull requests, analytics,
                        and collaboration into one unified developer workspace.
                    </motion.p>

                    <motion.div variants={fadeInUp} className="hero-cta">
                        <button className="btn-primary-lg" onClick={() => navigate('/register')}>
                            Start Building Free <ChevronRight size={20} />
                        </button>
                        <button className="btn-secondary-lg" onClick={() => navigate('/login')}>
                            <Terminal size={20} /> View Demo
                        </button>
                    </motion.div>
                </motion.div>
            </header>

            {/* Feature Grid */}
            <section id="features" className="features-section">
                <div className="section-header">
                    <h2 className="section-title">Everything you need to ship</h2>
                    <p className="section-subtitle">Powerful tools integrated into one seamless workflow.</p>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="features-grid"
                >
                    <FeatureCard
                        icon={<GitBranch />}
                        title="Version Control"
                        desc="Manage repositories, branches, and commits with enterprise-grade precision and speed."
                    />
                    <FeatureCard
                        icon={<GitPullRequest />}
                        title="Pull Requests"
                        desc="Collaborate on code changes with reviewers and merge securely."
                    />
                    <FeatureCard
                        icon={<Shield />}
                        title="Secure Access"
                        desc="Role-based permissions, JWT authentication, and audit logs keep your code safe."
                    />
                    <FeatureCard
                        icon={<Layout />}
                        title="Issue Tracking"
                        desc="Track bugs and feature requests with status updates and assignments."
                    />
                    <FeatureCard
                        icon={<Users />}
                        title="Team Collaboration"
                        desc="Real-time collaboration tools, team management, and activity feeds."
                    />
                    <FeatureCard
                        icon={<Globe />}
                        title="Developer Analytics"
                        desc="Visual insights into contribution graphs, commit velocity, and team performance."
                    />
                </motion.div>
            </section>



            {/* Why CodeOrbit? */}
            <section className="why-section">
                <div className="why-grid">
                    <div className="why-content">
                        <h2>Why Developers Choose CodeOrbit</h2>
                        <ul className="why-list">
                            <li>
                                <div className="check-icon">✓</div>
                                <div>
                                    <strong>All-in-one efficiency</strong>
                                    <p>No more context switching between Jira, GitHub, and Slack.</p>
                                </div>
                            </li>
                            <li>
                                <div className="check-icon">✓</div>
                                <div>
                                    <strong>Lightning fast performance</strong>
                                    <p>Built on modern tech for instant page loads and interactions.</p>
                                </div>
                            </li>
                            <li>
                                <div className="check-icon">✓</div>
                                <div>
                                    <strong>Developer-first design</strong>
                                    <p>Dark mode by default, keyboard shortcuts, and CLI integration.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="why-stat">
                        <div className="stat-card">
                            <span className="stat-number">10x</span>
                            <span className="stat-label">Faster Deployment</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">50%</span>
                            <span className="stat-label">Less Context Switching</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Ready to build better software?</h2>
                    <p>Join thousands of developers using CodeOrbit to ship faster.</p>
                    <button className="btn-primary-xl" onClick={() => navigate('/register')}>
                        Get Started for Free
                    </button>
                    <p className="cta-note">No credit card required • Free for open source</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <Code2 size={20} /> CodeOrbit
                        </div>
                        <p>The modern developer platform for the next generation of software teams.</p>
                        <div className="social-links">
                            <a href="#"><Github size={20} /></a>
                            <a href="#"><Twitter size={20} /></a>
                            <a href="#"><Linkedin size={20} /></a>
                        </div>
                    </div>
                    <div className="footer-links">
                        <div className="link-column">
                            <h4>Product</h4>
                            <a href="#">Features</a>
                            <a href="#">Security</a>
                            <a href="#">Enterprise</a>
                            <a href="#">Changelog</a>
                        </div>
                        <div className="link-column">
                            <h4>Resources</h4>
                            <a href="#">Documentation</a>
                            <a href="#">API Reference</a>
                            <a href="#">Guides</a>
                            <a href="#">Community</a>
                        </div>
                        <div className="link-column">
                            <h4>Company</h4>
                            <a href="#">About</a>
                            <a href="#">Blog</a>
                            <a href="#">Careers</a>
                            <a href="#">Contact</a>
                        </div>
                        <div className="link-column newsletter-column">
                            <h4>Stay Updated</h4>
                            <p>Subscribe to our newsletter for the latest updates.</p>
                            <div className="newsletter-form">
                                <input type="email" placeholder="Enter your email" />
                                <button className="btn-primary-sm">Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} CodeOrbit Inc. All rights reserved.</p>
                    <div className="footer-legal">
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
        }}
        className="feature-card"
    >
        <div className="feature-icon-wrapper">
            {icon}
        </div>
        <h3 className="feature-title">{title}</h3>
        <p className="feature-desc">{desc}</p>
    </motion.div>
);

export default LandingPage;
