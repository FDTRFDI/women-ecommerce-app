import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // Handle Input Change
  // =========================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================
  // Handle Login
  // =========================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      console.log(
        "LOGIN REQUEST:",
        formData.email
      );

      // IMPORTANT:
      // axios.js baseURL:
      // https://backend-women-ecommerce.onrender.com
      //
      // لذلك نضيف /api هنا
      const response = await axios.post(
        "/api/auth/login",
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      const data = response.data;

      console.log(
        "LOGIN RESPONSE:",
        data
      );

      // =========================
      // Check Token
      // =========================
      if (!data?.token) {
        console.error(
          "Login response does not contain token:",
          data
        );

        throw new Error(
          "Login successful but token was not returned by server."
        );
      }

      // =========================
      // Save Token
      // =========================
      localStorage.setItem(
        "token",
        data.token
      );

      // =========================
      // Save User
      // =========================
      const user = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        token: data.token,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      console.log(
        "USER SAVED:",
        user
      );

      // =========================
      // Success
      // =========================
      alert("Login Successful ✅");

      // =========================
      // Redirect
      // =========================
      if (data.role === "admin") {
        navigate("/admin", {
          replace: true,
        });
      } else {
        navigate("/", {
          replace: true,
        });
      }
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      console.error(
        "STATUS:",
        error.response?.status
      );

      console.error(
        "DATA:",
        error.response?.data
      );

      let message =
        "Server connection error";

      if (error.response?.data?.message) {
        message =
          error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="login-container">
      <div className="login-box">

        <h1>Welcome Back</h1>

        <p>
          Login to your account
        </p>

        <form onSubmit={handleLogin}>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />

          {/* Login Button */}
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* Register */}
        <p className="login-footer">
          Don’t have an account?{" "}

          <Link
            to="/register"
            className="signup-link"
          >
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;