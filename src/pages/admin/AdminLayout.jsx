import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <AdminNavbar />
      <div style={{ flex: 1, padding: "20px" }}>
        {children}
      </div>
    </div>
  );
}
