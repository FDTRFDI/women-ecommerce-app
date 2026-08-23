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
      console.log("LOGIN REQUEST:", {
        email: formData.email,
      });

      /*
       * axios.js already has:
       *
       * https://backend-women-ecommerce.onrender.com/api
       *
       * Therefore this request becomes:
       *
       * POST
       * https://backend-women-ecommerce.onrender.com/api/auth/login
       */

      const response = await axios.post(
        "/auth/login",
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      const data = response.data;

      console.log("LOGIN RESPONSE:", data);

      /*
       * Make sure token exists
       */
      if (!data?.token) {
        console.error("No token returned from server:", data);

        alert(
          data?.message ||
            "Login failed: server did not return a token."
        );

        return;
      }

      /*
       * Save logged-in user
       */
      const userData = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        token: data.token,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      console.log("USER SAVED:", userData);

      alert("Login Successful ✅");

      /*
       * Redirect according to user role
       */
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
      console.error("LOGIN ERROR:", error);

      console.error(
        "STATUS:",
        error.response?.status
      );

      console.error(
        "DATA:",
        error.response?.data
      );

      let message = "Server connection error";

      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.status === 404) {
        message =
          "Login endpoint not found. Check backend API route.";
      } else if (error.response?.status === 400) {
        message =
          error.response.data?.message ||
          "Invalid email or password.";
      } else if (error.response?.status === 401) {
        message =
          error.response.data?.message ||
          "Invalid email or password.";
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
    <div className="login-container">

      <div className="login-box">

        <h1>Welcome Back</h1>

        <p>Login to your account</p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />

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