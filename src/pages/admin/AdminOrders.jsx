import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import "./admin.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get("/api/admin/orders");

      setOrders(
        Array.isArray(data)
          ? data
          : data?.orders || data?.data || []
      );
    } catch (error) {
      console.error("Error fetching orders:", error);

      setError(
        error.response?.data?.message ||
        "Error loading orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `/api/admin/orders/${orderId}`,
        { status }
      );

      await fetchOrders();

      alert(`Order #${orderId} updated to ${status}`);
    } catch (error) {
      console.error("Error updating order:", error);

      alert(
        error.response?.data?.message ||
        "Error updating order"
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="admin-dashboard-container">

      <div className="admin-dashboard-header">

        <div>
          <h1 className="admin-title">
            Manage Orders
          </h1>

          <p>
            View and manage customer orders.
          </p>
        </div>

        <button
          type="button"
          className="btn primary"
          onClick={fetchOrders}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>

      </div>

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      <div className="admin-table-wrapper">

        <table className="admin-table">

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

            {loading ? (
              <tr>
                <td colSpan="5">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="5">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>

                  <td>
                    #{order.id}
                  </td>

                  <td>
                    {order.customer_name ||
                      order.customerName ||
                      order.user?.name ||
                      "N/A"}
                  </td>

                  <td>
                    ${order.total_price || 0}
                  </td>

                  <td>
                    {order.status || "Pending"}
                  </td>

                  <td>

                    <button
                      type="button"
                      className="btn success small"
                      onClick={() =>
                        updateStatus(
                          order.id,
                          "Paid"
                        )
                      }
                    >
                      Mark Paid
                    </button>

                    <button
                      type="button"
                      className="btn primary small"
                      onClick={() =>
                        updateStatus(
                          order.id,
                          "Shipped"
                        )
                      }
                    >
                      Mark Shipped
                    </button>

                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AdminOrders;