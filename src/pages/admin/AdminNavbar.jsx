import { Link, useNavigate } from "react-router-dom";
import "./admin.css";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="admin-navbar">
      <div className="admin-brand">
        <h2>Admin Panel</h2>
        <p>Women E-Commerce</p>
      </div>

      <nav className="admin-links">
        <Link to="/admin">
          📊 Dashboard
        </Link>

        <Link to="/admin/products">
          👜 Products
        </Link>

        <Link to="/admin/categories">
          📁 Categories
        </Link>

        <Link to="/admin/orders">
          📦 Orders
        </Link>

        <Link to="/admin/users">
          👥 Users
        </Link>
      </nav>

      <div className="admin-actions">
        <Link to="/">
          🏠 Back to Store
        </Link>

        <button type="button" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminNavbar;