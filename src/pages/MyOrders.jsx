import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./myOrders.css";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    if (!token) {
      console.log("No token found");
      return;
    }

    fetch("http://localhost:5000/api/orders/my-orders", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err));
  }, []);

return (
  <div className="orders-page">

    <div className="back-wrapper">
      <button className="back-home-btn" onClick={() => navigate("/")}>
        ⬅ Back to Home
      </button>
    </div>

    <h1>My Orders</h1>

      {orders.length === 0 && <p>No orders found.</p>}

      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <p><strong>Order ID:</strong> #{order.id}</p>
          <p><strong>Total:</strong> {order.total_price} AED</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}