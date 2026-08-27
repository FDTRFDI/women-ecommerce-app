import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      const data = response.data;

      console.log("ADMIN LOGIN RESPONSE:", data);

      // ==============================
      // CHECK TOKEN
      // ==============================

      if (!data?.token) {
        setError("Login failed. No authentication token received.");
        return;
      }

      // ==============================
      // CHECK ADMIN ROLE
      // ==============================

      if (data.role !== "admin") {
        setError(
          "Access denied. This account is not an administrator."
        );
        return;
      }

      // ==============================
      // SAVE ADMIN
      // ==============================

      const adminData = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        token: data.token,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(adminData)
      );

      console.log("ADMIN SAVED:", adminData);

      // ==============================
      // GO TO ADMIN DASHBOARD
      // ==============================

      navigate("/admin", {
        replace: true,
      });

    } catch (error) {
      console.error("ADMIN LOGIN ERROR:", error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 401) {
        setError("Invalid email or password.");
      } else if (error.response?.status === 403) {
        setError("You do not have admin access.");
      } else if (error.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Unable to connect to the server.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">

      {/* BACKGROUND DECORATION */}
      <div className="admin-bg-circle circle-one"></div>
      <div className="admin-bg-circle circle-two"></div>

      <div className="admin-login-container">

        {/* LOGO / BRAND */}
        <div className="admin-login-brand">

          <div className="admin-logo">
            O
          </div>

          <div>
            <h1>Omnera</h1>
            <span>Administration</span>
          </div>

        </div>

        {/* LOGIN CARD */}
        <div className="admin-login-card">

          <div className="admin-login-icon">
            🔐
          </div>

          <h2>Admin Login</h2>

          <p className="admin-login-subtitle">
            Sign in to access the administration panel
          </p>

          {/* ERROR */}
          {error && (
            <div className="admin-login-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleLogin}>

            {/* EMAIL */}
            <div className="admin-input-group">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="admin-input-wrapper">

                <span className="admin-input-icon">
                  ✉
                </span>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter admin email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div className="admin-input-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="admin-input-wrapper">

                <span className="admin-input-icon">
                  🔑
                </span>

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter admin password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

              </div>

            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="admin-login-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="admin-spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Login as Admin
                  <span>→</span>
                </>
              )}

            </button>

          </form>

          {/* SECURITY MESSAGE */}
          <div className="admin-security">

            <span>🔒</span>

            <div>
              <strong>Secure Access</strong>

              <p>
                This area is restricted to authorized
                administrators only.
              </p>
            </div>

          </div>

          {/* BACK TO WEBSITE */}
          <Link
            to="/"
            className="admin-back-link"
          >
            ← Back to Website
          </Link>

        </div>

        {/* FOOTER */}
        <p className="admin-login-footer">
          © {new Date().getFullYear()} Omnera. All rights reserved.
        </p>

      </div>

    </div>
  );
};

export default AdminLogin;