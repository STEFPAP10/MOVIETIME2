import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getProfiles } from "../api/api";

import "../styles/Logo.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email",data.email);
        const profiles = await getProfiles(data.email);  
        const active = profiles.find(
  (p) => p.username.trim().toLowerCase() === data.username.trim().toLowerCase()
);
if (active) {
  const fullProfile = { ...active, email: data.email }; // για να έχει και email
  localStorage.setItem("activeProfile", JSON.stringify(fullProfile));
}
      // 👈 από το api.js
//       if (profiles.length > 0) {
// localStorage.setItem("activeProfile", JSON.stringify({
//   _id: data._id,
//   username: data.username,
//   email: data.email,
//   avatar: data.avatar
// }));
//         }
if (active) {
  localStorage.setItem("activeProfile", JSON.stringify(active));
}

        navigate("/home");
      } else {
        setError(data.msg || "Λάθος όνομα χρήστη ή κωδικός.");
      }
    } catch (err) {
      setError("Σφάλμα σύνδεσης.");
    }
  };

  return (
    <div className="page">
      <div className="wrapper">
        <h1>Login</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <i className="bx bx-user"></i>
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i className="bx bx-lock-alt"></i>
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit" className="btn">Login</button>
          <div className="remember-link">
            <p>Don't have an account? <Link to="/register">Register</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;