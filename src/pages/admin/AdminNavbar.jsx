import { Link } from "react-router-dom";
import "./admin.css";

const AdminNavbar = () => {
  return (
    <nav className="admin-navbar">
      <Link to="/admin">Dashboard</Link>
      <Link to="/admin/products">Products</Link>
      <Link to="/admin/orders">Orders</Link>
      <Link to="/admin/users">Users</Link>
    </nav>
  );
};

export default AdminNavbar;