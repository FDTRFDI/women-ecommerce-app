import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderSuccess.css";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // جلب اخر اوردر محفوظ
    const savedOrder = localStorage.getItem("lastOrder");

    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  if (!order) {
    return (
      <div className="order-success-container">
        <div className="order-box">
          <h2>No Order Found ❌</h2>
          <button onClick={() => navigate("/")}>
            Back To Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-container">
      <div className="order-box success">
        <h1>✅ Order Placed Successfully</h1>

        <div className="order-info">
          <p><strong>Order ID:</strong> #{order.id}</p>
          <p><strong>Total:</strong> {order.total} AED</p>
          <p><strong>Date:</strong> {order.date}</p>
        </div>

        <div className="order-actions">
          <button onClick={() => navigate("/")}>
            Continue Shopping
          </button>

          <button
            className="secondary"
            onClick={() => navigate("/orders")}
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
}
