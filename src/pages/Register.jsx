import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    alert("Account Created Successfully ✅");
    navigate("/login");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Create Account</h1>
        <p>Register a new account</p>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button className="login-btn">Create Account</button>
        </form>
      </div>
    </div>
  );
};

export default Register;