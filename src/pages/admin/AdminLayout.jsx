import AdminNavbar from "./AdminNavbar";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">

      {/* Sidebar / Navbar */}
      <AdminNavbar />

      {/* Main Content */}
      <main className="admin-content">
        {children}
      </main>

    </div>
  );
};

export default AdminLayout;