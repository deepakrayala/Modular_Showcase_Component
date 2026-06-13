import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminPage.css";

export default function AdminPage() {

  const { user, authFetch, GATEWAY_URL } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "", email: "", password: "", roleId: "1",
  });
  const [addError, setAddError] = useState("");

  // ROLE CHECK + DATA FETCH
  useEffect(() => {
    if (user && user.roleId !== 2) {
      navigate("/dashboard", { replace: true });
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      // Fetch users (admin-only endpoint)
      const usersRes = await authFetch(`${GATEWAY_URL}/api/auth/users`);

console.log("Users Status:", usersRes.status);

if (usersRes.ok) {
  const data = await usersRes.json();
  console.log("Users Data:", data);
  setUsers(data.users || data);
} else {
  const errorText = await usersRes.text();
  console.log("Users Error:", errorText);
  setError(`Failed to fetch users (${usersRes.status})`);
}

      // Fetch components
      const compRes = await fetch(`${GATEWAY_URL}/api/components`);
      if (compRes.ok) {
        const data = await compRes.json();
        setComponents(data || []);
      }

    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // DELETE USER
  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Delete user "${userName}"?`)) return;

    try {
      const res = await authFetch(`${GATEWAY_URL}/api/auth/users/${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== userId));
      } else {
        const data = await res.json();
        alert(data.detail || data.message || "Failed to delete user");
      }
    } catch (err) {
      alert(err.message || "Failed to fetch");
    }
  };

  // ADD USER
  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddError("");

    try {
      const res = await authFetch(`${GATEWAY_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          roleId: parseInt(newUser.roleId),
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewUser({ name: "", email: "", password: "", roleId: "1" });
        fetchData();
      } else {
        const data = await res.json();
        setAddError(data.detail || data.message || data.error || "Failed to add user");
      }
    } catch (err) {
      setAddError(err.message || "Failed to fetch");
    }
  };

  // ROLE BADGE
  const getRoleBadgeClass = (roleId) => {
    if (roleId === 1) return "role-user";
    if (roleId === 2) return "role-admin";
    return "role-other";
  };

  const isServerDownError = !error || error === "Failed to fetch" || error.includes("abort");

  // LOADING
  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">Loading data...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* SERVER ERROR */}
      {isServerDownError && error && (
        <div className="server-down-banner">
          <span className="server-down-icon">🔌</span>
          <div className="server-down-text">
            <strong>Backend Not Reachable</strong>
            <p>"{error}" — Gateway on port 8000 is not running.</p>
          </div>
          <button className="btn-retry" onClick={fetchData}>Retry Connection</button>
        </div>
      )}

      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h1>Admin Panel</h1>
          <p className="admin-subtitle">Manage users, components, and system data</p>
        </div>
        <div className="admin-badge">
          {user?.roleName?.toUpperCase() || "ADMIN"}
        </div>
      </div>

      {/* ERROR */}
      {error && !isServerDownError && (
        <div className="alert alert-error">{error}</div>
      )}

      {/* STATS */}
      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-number">{users.length}</span>
          <span className="stat-label">Total Users</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{users.filter((u) => u.roleId === 1).length}</span>
          <span className="stat-label">Regular Users</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{users.filter((u) => u.roleId === 2).length}</span>
          <span className="stat-label">Admins</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{components.length}</span>
          <span className="stat-label">Components</span>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="admin-section">
        <div className="section-header">
          <h2>All Users</h2>
          <button className="admin-action-btn" onClick={() => setShowAddModal(true)}>
            + Add User
          </button>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-badge ${getRoleBadgeClass(u.roleId)}`}>
                      {u.roleName}
                    </span>
                  </td>
                  <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(u.id, u.name)}
                      disabled={u.id === user?.id}
                    >
                      {u.id === user?.id ? "You" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="admin-section">
        <h2>Quick Actions</h2>
        <div className="admin-actions">
          <button className="admin-action-btn" onClick={fetchData}>Refresh All Data</button>
          <button className="admin-action-btn secondary" onClick={() => window.open(`${GATEWAY_URL}/health`, "_blank")}>
            Check Gateway Health
          </button>
        </div>
      </div>

      {/* ADD USER MODAL */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Add New User</h2>
            {addError && <div className="alert alert-error">{addError}</div>}
            <form onSubmit={handleAddUser}>
              <input type="text" placeholder="Enter name" value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
              <input type="email" placeholder="Enter email" value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
              <input type="password" placeholder="Enter password" value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
              <select value={newUser.roleId}
                onChange={(e) => setNewUser({ ...newUser, roleId: e.target.value })}>
                <option value="1">User</option>
                <option value="2">Admin</option>
              </select>
              <div className="modal-actions">
                <button type="button" className="secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
