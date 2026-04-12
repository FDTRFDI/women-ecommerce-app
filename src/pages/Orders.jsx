import React, { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/orders/my-orders/1")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order.id}>
            <h3>Order #{order.id}</h3>
            <p>Total: {order.total} AED</p>
            <p>Status: {order.status}</p>
            <p>
              Date: {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
