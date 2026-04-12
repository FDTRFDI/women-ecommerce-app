import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrderHistory.css";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [openOrder, setOpenOrder] = useState(null);
  const [items, setItems] = useState([]);

  // =============================
  // STATUS STYLE
  // =============================
  const getStatusClass = (status) => {
    switch (status) {
      case "Processing":
        return "status processing";
      case "Shipped":
        return "status shipped";
      case "Delivered":
        return "status delivered";
      default:
        return "status pending";
    }
  };

  // =============================
  // GET ORDERS
  // =============================
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    if (!token) {
      console.log("No token found");
      return;
    }

    axios
      .get("http://localhost:5000/api/orders/my-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Orders:", res.data);
        setOrders(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // =============================
  // TOGGLE ORDER ITEMS
  // =============================
  const toggleOrder = async (orderId) => {
    if (openOrder === orderId) {
      setOpenOrder(null);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/${orderId}/items`
      );

      setItems(res.data);
      setOpenOrder(orderId);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {orders.length === 0 && <p>No orders found.</p>}

      {orders.map((order) => (
        <div key={order.id} className="order-card">
          {/* ================= HEADER ================= */}
          <div
            className="order-header"
            onClick={() => toggleOrder(order.id)}
          >
            <div>
              <h3>Order #{order.id}</h3>

              <p>{new Date(order.created_at).toLocaleDateString()}</p>

              {/* STATUS BADGE */}
              <span className={getStatusClass(order.status)}>
                {order.status || "Pending"}
              </span>
            </div>

            <div className="order-info">
              <span className="price">{order.total_price} AED</span>

              <button>
                {openOrder === order.id ? "Hide" : "View Items"}
              </button>
            </div>
          </div>

          {/* ================= ITEMS ================= */}
          {openOrder === order.id && (
            <div className="order-items">
              {items.length === 0 ? (
                <p>No items found</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="order-item">
                    <img src={item.image} alt={item.name} />

                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity}</p>
                    </div>

                    <div className="item-price">
                      {item.price} AED
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default OrderHistory;