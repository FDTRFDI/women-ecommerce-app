import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import "./admin.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get("/admin/users");

      setUsers(
        Array.isArray(data)
          ? data
          : data?.users || data?.data || []
      );
    } catch (err) {
      console.error("Error fetching users:", err);

      setError(
        err.response?.data?.message ||
        "Error loading users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-dashboard-container">

      <div className="admin-dashboard-header">

        <div>
          <h1 className="admin-title">
            Manage Users
          </h1>

          <p>
            View registered users.
          </p>
        </div>

        <button
          type="button"
          className="btn primary"
          onClick={fetchUsers}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>

      </div>

      {error && (
        <div className="admin-error">
          {error}
        </div>
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

            {loading ? (
              <tr>
                <td colSpan="4">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="4">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>

                  <td>
                    {user.id}
                  </td>

                  <td>
                    {user.name}
                  </td>

                  <td>
                    {user.email}
                  </td>

                  <td>
                    {user.role}
                  </td>

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