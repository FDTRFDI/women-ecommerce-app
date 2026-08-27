import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../utils/axios";
import "./admin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const response = await axios.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      const data = response.data;

      console.log("ADMIN LOGIN RESPONSE:", data);

      // ==========================================
      // TOKEN CHECK
      // ==========================================

      if (!data?.token) {
        alert(
          data?.message ||
            "Login failed: server did not return a token."
        );

        return;
      }

      // ==========================================
      // ADMIN CHECK
      // ==========================================

      if (data.role !== "admin") {
        alert("Access denied. Admin account required.");

        return;
      }

      // ==========================================
      // SAVE ADMIN
      // ==========================================

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

      alert("Admin Login Successful ✅");

      // ==========================================
      // REDIRECT
      // ==========================================

      const from =
        location.state?.from?.pathname || "/admin";

      navigate(from, {
        replace: true,
      });

    } catch (error) {
      console.error("ADMIN LOGIN ERROR:", error);

      console.error(
        "STATUS:",
        error.response?.status
      );

      console.error(
        "DATA:",
        error.response?.data
      );

      let message = "Server connection error.";

      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.status === 401) {
        message = "Invalid email or password.";
      } else if (error.response?.status === 403) {
        message = "Admin access denied.";
      } else if (error.response?.status === 404) {
        message =
          "Login endpoint not found. Check backend API.";
      } else if (error.response?.status >= 500) {
        message =
          "Backend server error. Please try again later.";
      }

      alert(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-box">

        <div className="admin-login-header">

          <div className="admin-login-icon">
            🔐
          </div>

          <h1>
            Admin Login
          </h1>

          <p>
            Sign in to access the administration panel
          </p>

        </div>

        <form onSubmit={handleLogin}>

          <div className="admin-form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Admin email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />

          </div>

          <div className="admin-form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Admin password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />

          </div>

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Login as Admin"}
          </button>

        </form>

        <div className="admin-login-footer">
          <button
            type="button"
            onClick={() => navigate("/")}
          >
            ← Back to Website
          </button>
        </div>

      </div>

    </div>
  );
};

export default AdminLogin;