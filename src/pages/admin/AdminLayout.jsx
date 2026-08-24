import AdminNavbar from "./AdminNavbar";
import "./admin.css";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminNavbar />

      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}