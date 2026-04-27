import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";

// Primer imports removed
import "./auth.css";
import { Link } from "react-router-dom";

const Login = () => {
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/login", {
        email: email,
        password: password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      await setCurrentUser(res.data.userId); // Ensure this updates
      setLoading(false);

      // Use navigate instead of hard reload
      // The Routes.jsx listens to currentUser, so it might auto-redirect, but explicit navigate is safer
      // We will need to import useNavigate though.
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Login Failed!";
      alert(msg);
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box-wrapper">
        <div className="login-box">
          <div className="login-heading">
            <h1>Welcome Back</h1>
            <p>Enter your details to sign in</p>
          </div>

          <div className="input-group">
            <label className="label">Email address</label>
            <input
              autoComplete="off"
              name="Email"
              id="Email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>
          <div className="input-group">
            <label className="label">Password</label>
            <input
              autoComplete="off"
              name="Password"
              id="Password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            className="login-btn"
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? "Loading..." : "Sign In"}
          </button>

          <div className="pass-box">
            <p>
              New here? <Link to="/register">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;