import { Link, useLocation, useNavigate } from "react-router-dom";
import "./admin.css";

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <aside className="admin-navbar">

      {/* Logo / Title */}
      <div className="admin-navbar-header">
        <h2>Admin Panel</h2>
        <p>Women E-Commerce</p>
      </div>

      {/* Navigation */}
      <nav className="admin-nav">

        <Link
          to="/admin"
          className={isActive("/admin") ? "admin-link active" : "admin-link"}
        >
          <span>📊</span>
          Dashboard
        </Link>

        <Link
          to="/admin/products"
          className={
            isActive("/admin/products")
              ? "admin-link active"
              : "admin-link"
          }
        >
          <span>🛍️</span>
          Products
        </Link>

        <Link
          to="/admin/categories"
          className={
            isActive("/admin/categories")
              ? "admin-link active"
              : "admin-link"
          }
        >
          <span>📂</span>
          Categories
        </Link>

        <Link
          to="/admin/orders"
          className={
            isActive("/admin/orders")
              ? "admin-link active"
              : "admin-link"
          }
        >
          <span>📦</span>
          Orders
        </Link>

        <Link
          to="/admin/users"
          className={
            isActive("/admin/users")
              ? "admin-link active"
              : "admin-link"
          }
        >
          <span>👥</span>
          Users
        </Link>

      </nav>

      {/* Bottom */}
      <div className="admin-navbar-footer">

        <Link to="/" className="admin-link">
          <span>🏠</span>
          Back to Store
        </Link>

        <button
          type="button"
          className="admin-logout"
          onClick={handleLogout}
        >
          <span>🚪</span>
          Logout
        </button>

      </div>

    </aside>
  );
};

export default AdminNavbar;