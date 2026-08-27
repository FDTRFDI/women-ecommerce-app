import { Navigate, Outlet, useLocation } from "react-router-dom";

const AdminRoute = () => {
  const location = useLocation();

  let user = null;

  try {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      user = JSON.parse(savedUser);
    }
  } catch (error) {
    console.error("Invalid user data:", error);
    localStorage.removeItem("user");
  }

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!user) {
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // ==========================================
  // LOGGED IN BUT NOT ADMIN
  // ==========================================

  if (user.role !== "admin") {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // ==========================================
  // ADMIN
  // ==========================================

  return <Outlet />;
};

export default AdminRoute;