import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/logo.css";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("❌ Οι κωδικοί δεν ταιριάζουν.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("✅ Εγγραφή επιτυχής Επιστροφη για Συνδεση!");
        setUsername(""); setEmail(""); setPassword(""); setConfirmPassword("");
      } else {
        setError(data.msg || "❌ Αποτυχία εγγραφής.");
      }
    } catch (err) {
      setError("❌ Σφάλμα σύνδεσης.");
    }
  };

  return (
    <div className="page">
      <div className="wrapper">
        <h1>Register</h1>
        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleRegister}>
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
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <i className="bx bx-envelope"></i>
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
          <div className="input-box">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <i className="bx bx-lock"></i>
          </div>
          <button type="submit" className="btn">Register</button>
          <div className="remember-link">
            <p>Έχεις ήδη λογαριασμό; <Link to="/">Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;