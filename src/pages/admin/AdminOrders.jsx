import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import AdminNavbar from "./AdminNavbar";

const TELEGRAM_TOKEN = "YOUR_BOT_TOKEN";
const TELEGRAM_CHAT_ID = "CLIENT_CHAT_ID"; // مثال: +971542483423

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/admin/orders");
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}`, { status });

      // إرسال رسالة Telegram تلقائيًا
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: `Your order #${orderId} has been updated to status: ${status}`,
        }),
      });

      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <AdminNavbar />
      <h1>Manage Orders</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer_name}</td>
              <td>${order.total_price}</td>
              <td>{order.status}</td>
              <td>
                <button onClick={() => updateStatus(order.id, "Paid")}>Mark Paid</button>
                <button onClick={() => updateStatus(order.id, "Shipped")}>Mark Shipped</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;