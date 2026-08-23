import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
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

  // المستخدم غير مسجل الدخول
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // المستخدم ليس Admin
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Admin مسجل الدخول
  return <Outlet />;
};

export default AdminRoute;