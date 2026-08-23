import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import "./admin.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const results = await Promise.allSettled([
        axios.get("/api/products"),
        axios.get("/api/categories"),
        axios.get("/api/orders"),
        axios.get("/api/users"),
      ]);

      const products =
        results[0].status === "fulfilled"
          ? results[0].value.data
          : [];

      const categories =
        results[1].status === "fulfilled"
          ? results[1].value.data
          : [];

      const orders =
        results[2].status === "fulfilled"
          ? results[2].value.data
          : [];

      const users =
        results[3].status === "fulfilled"
          ? results[3].value.data
          : [];

      setStats({
        products: Array.isArray(products)
          ? products.length
          : products?.data?.length || 0,

        categories: Array.isArray(categories)
          ? categories.length
          : categories?.data?.length || 0,

        orders: Array.isArray(orders)
          ? orders.length
          : orders?.data?.length || 0,

        users: Array.isArray(users)
          ? users.length
          : users?.data?.length || 0,
      });

    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container">

      {/* HEADER */}
      <div className="admin-dashboard-header">
        <div>
          <h1 className="admin-title">
            Dashboard
          </h1>

          <p>
            Welcome to your Women E-Commerce admin panel.
          </p>
        </div>

        <button
          className="btn primary"
          onClick={fetchDashboardData}
        >
          Refresh
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      {/* STATS */}
      <div className="dashboard-stats">

        {/* PRODUCTS */}
        <div className="dashboard-card">
          <div className="dashboard-card-icon">
            🛍️
          </div>

          <div>
            <h3>Products</h3>

            <strong>
              {loading ? "..." : stats.products}
            </strong>
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="dashboard-card">
          <div className="dashboard-card-icon">
            📂
          </div>

          <div>
            <h3>Categories</h3>

            <strong>
              {loading ? "..." : stats.categories}
            </strong>
          </div>
        </div>

        {/* ORDERS */}
        <div className="dashboard-card">
          <div className="dashboard-card-icon">
            📦
          </div>

          <div>
            <h3>Orders</h3>

            <strong>
              {loading ? "..." : stats.orders}
            </strong>
          </div>
        </div>

        {/* USERS */}
        <div className="dashboard-card">
          <div className="dashboard-card-icon">
            👥
          </div>

          <div>
            <h3>Users</h3>

            <strong>
              {loading ? "..." : stats.users}
            </strong>
          </div>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="dashboard-section">

        <h2>
          Quick Actions
        </h2>

        <div className="dashboard-actions">

          <a
            href="/admin/products"
            className="dashboard-action"
          >
            <span>🛍️</span>
            <div>
              <strong>Manage Products</strong>
              <small>
                Add, edit or delete products
              </small>
            </div>
          </a>

          <a
            href="/admin/categories"
            className="dashboard-action"
          >
            <span>📂</span>
            <div>
              <strong>Manage Categories</strong>
              <small>
                Create and manage categories
              </small>
            </div>
          </a>

          <a
            href="/admin/orders"
            className="dashboard-action"
          >
            <span>📦</span>
            <div>
              <strong>Manage Orders</strong>
              <small>
                View customer orders
              </small>
            </div>
          </a>

          <a
            href="/admin/users"
            className="dashboard-action"
          >
            <span>👥</span>
            <div>
              <strong>Manage Users</strong>
              <small>
                View registered users
              </small>
            </div>
          </a>

        </div>

      </div>

      {/* SYSTEM STATUS */}
      <div className="dashboard-section">

        <h2>
          System Status
        </h2>

        <div className="system-status">

          <div className="status-item">
            <span className="status-dot"></span>
            <span>
              Backend API
            </span>
            <strong>
              Connected
            </strong>
          </div>

          <div className="status-item">
            <span className="status-dot"></span>
            <span>
              Database
            </span>
            <strong>
              Connected
            </strong>
          </div>

          <div className="status-item">
            <span className="status-dot"></span>
            <span>
              Admin Authentication
            </span>
            <strong>
              Active
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;