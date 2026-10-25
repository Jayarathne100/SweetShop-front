import React, { useCallback, useEffect, useState } from "react";

import styles from "./adminUsers.module.css";

import { useAuth } from "../../../context/AuthContext";
import AdminNavigation from "../../../components/AdminNavigation/AdminNavigation";

import {
  getUsers,
  deleteUser,
} from "../../../services/userService";

const AdminUsers = () => {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Load users from MongoDB through the backend API
  const loadUsers = useCallback(async () => {
    if (!token) {
      setUsers([]);
      setError("Please log in as an administrator.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getUsers(token);

      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      setError(err.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Delete a non-admin user
  const handleDelete = async (user) => {
    if (!token || !user._id) {
      setError("Unable to identify this user.");
      return;
    }

    if (user.role === "admin") {
      setError("Administrator accounts cannot be deleted here.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name || user.email}?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(user._id);
      setError("");
      setMessage("");

      await deleteUser(user._id, token);

      setUsers((previousUsers) =>
        previousUsers.filter((item) => item._id !== user._id)
      );

      setMessage("User deleted successfully.");
    } catch (err) {
      setError(err.message || "Failed to delete user.");
    } finally {
      setDeletingId("");
    }
  };

  // Search by name, email, phone, or role
  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase().trim();

    return (
      (user.name || "").toLowerCase().includes(searchText) ||
      (user.email || "").toLowerCase().includes(searchText) ||
      (user.phone || "").toLowerCase().includes(searchText) ||
      (user.role || "").toLowerCase().includes(searchText)
    );
  });

  const adminCount = users.filter(
    (user) => user.role === "admin"
  ).length;

  const customerCount = users.filter(
    (user) => user.role !== "admin"
  ).length;

  return (
    <div className={styles.adminLayout}>
      <AdminNavigation />

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>Store Management</span>
            <h1>Users</h1>
            <p>Manage registered SweetSpot users.</p>
          </div>

          <button
            type="button"
            className={styles.refreshButton}
            onClick={loadUsers}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh Users"}
          </button>
        </header>

        {error && (
          <div className={styles.errorMessage} role="alert">
            {error}
          </div>
        )}

        {message && (
          <div className={styles.successMessage} role="status">
            {message}
          </div>
        )}

        {/* User statistics */}
        <section className={styles.stats}>
          <div className={styles.statCard}>
            <span>👥</span>
            <p>Total Users</p>
            <h2>{users.length}</h2>
          </div>

          <div className={styles.statCard}>
            <span>🛍️</span>
            <p>Customers</p>
            <h2>{customerCount}</h2>
          </div>

          <div className={styles.statCard}>
            <span>🔐</span>
            <p>Administrators</p>
            <h2>{adminCount}</h2>
          </div>
        </section>

        {/* User list */}
        <section className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div>
              <h2>All Users</h2>
              <p>Registered accounts retrieved from your database.</p>
            </div>

            <span className={styles.userCount}>
              {filteredUsers.length} users
            </span>
          </div>

          <div className={styles.searchContainer}>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, phone, or role..."
              aria-label="Search users"
            />
          </div>

          {loading ? (
            <div className={styles.emptyState}>
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className={styles.emptyState}>
              <span>👤</span>
              <h3>No users found</h3>
              <p>
                {search
                  ? "Try a different search term."
                  : "Registered users will appear here."}
              </p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Registered</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td className={styles.userName}>
                        {user.name || "Not provided"}
                      </td>

                      <td>{user.email || "Not provided"}</td>

                      <td>{user.phone || "Not provided"}</td>

                      <td>
                        <span
                          className={
                            user.role === "admin"
                              ? styles.adminBadge
                              : styles.customerBadge
                          }
                        >
                          {user.role || "customer"}
                        </span>
                      </td>

                      <td>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "—"}
                      </td>

                      <td>
                        {user.role === "admin" ? (
                          <span className={styles.protectedText}>
                            Protected
                          </span>
                        ) : (
                          <button
                            type="button"
                            className={styles.deleteButton}
                            disabled={deletingId === user._id}
                            onClick={() => handleDelete(user)}
                          >
                            {deletingId === user._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminUsers;