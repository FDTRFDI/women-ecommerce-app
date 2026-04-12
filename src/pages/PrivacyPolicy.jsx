// src/pages/PrivacyPolicy.jsx

import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="container">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().getFullYear()}</p>

      <h2>1. Information We Collect</h2>
      <p>
        We may collect personal information such as name, email address,
        payment information (processed securely via Stripe), and usage data.
      </p>

      <h2>2. How We Use Information</h2>
      <ul>
        <li>To provide and maintain our services</li>
        <li>To process payments securely</li>
        <li>To improve user experience</li>
        <li>To prevent fraud and abuse</li>
      </ul>

      <h2>3. Payment Processing</h2>
      <p>
        All payments are processed via Stripe. We do not store full card details
        on our servers.
      </p>

      <h2>4. Data Security</h2>
      <p>
        We implement appropriate technical measures to protect your data.
      </p>

      <h2>5. Contact</h2>
      <p>Email: omnera68@gmail.com</p>
    </div>
  );
}