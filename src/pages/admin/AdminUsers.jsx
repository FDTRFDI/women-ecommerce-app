import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import "./admin.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/admin/users");

      setUsers(
        Array.isArray(data)
          ? data
          : data.users || []
      );
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(
        err.response?.data?.message ||
        "Error loading users"
      );
    }
  };

  return (
    <div className="admin-dashboard-container">

      <h1 className="admin-title">
        Manage Users
      </h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <div className="admin-table-wrapper">

        <table className="admin-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>

                  <td>{user.id}</td>

                  <td>{user.name}</td>

                  <td>{user.email}</td>

                  <td>{user.role}</td>

                </tr>
              ))
            )}
          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AdminUsers;