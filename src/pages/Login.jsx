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
    setLoading(true);

    try {
      // Login API
      // axios.js already has /api in baseURL
      const { data } = await axios.post("/auth/login", formData);

      console.log("LOGIN RESPONSE:", data);

      // Save user + token
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          token: data.token,
        })
      );

      alert("Login Successful ✅");

      // Redirect according to role
      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      console.error("STATUS:", error.response?.status);
      console.error("DATA:", error.response?.data);

      alert(
        error.response?.data?.message ||
          "Server connection error"
      );
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
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
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