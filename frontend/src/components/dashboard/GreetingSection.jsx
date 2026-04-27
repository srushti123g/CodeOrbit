import React, { useState, useEffect } from "react";
import "./dashboard.css";

const GreetingSection = () => {
  const [greeting, setGreeting] = useState("Good Evening");
  const [username, setUsername] = useState(localStorage.getItem("username") || "Developer");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const storedUser = localStorage.getItem("username");
    if (storedUser) setUsername(storedUser);
  }, []);

  return (
    <div className="greeting-section animate-fade-up">
      <h1 className="greeting-title">
        {greeting}, <span style={{ color: 'var(--primary-color)' }}>{username}</span> 👋
      </h1>
      <p className="greeting-subtitle">Here's what's happening with your projects today.</p>
    </div>
  );
};

export default GreetingSection;
