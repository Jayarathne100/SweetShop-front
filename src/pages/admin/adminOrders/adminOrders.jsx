import React, { useCallback, useEffect, useState } from "react";
import styles from "./adminOrders.module.css";

import AdminNavigation from "../../../components/AdminNavigation/AdminNavigation";
import { useAuth } from "../../../context/AuthContext";

import {
  getOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../../services/orderService";

const STATUSES = [
  "Pending",
  "Processing",
  "Completed",
  "Cancelled",
];

const AdminOrders = () => {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadOrders = useCallback(async () => {
    if (!token) {
      setError("Please log in as an administrator.");
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getOrders(token);
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      setError(err.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (order, status) => {
    const id = order._id;

    if (!id || !token || status === order.status) return;

    try {
      setUpdatingId(id);
      setError("");
      setMessage("");

      const result = await updateOrderStatus(id, status, token);

      setOrders((previous) =>
        previous.map((item) =>
          item._id === id
            ? { ...item, ...(result.order || {}), status }
            : item
        )
      );

      setMessage("Order status updated successfully.");
    } catch (err) {
      setError(err.message || "Unable to update order status.");
      await loadOrders();
    } finally {
      setUpdatingId("");
    }
  };

  const handleDelete = async (order) => {
    const id = order._id;

    if (!id || !token) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      await deleteOrder(id, token);

      setOrders((previous) =>
        previous.filter((item) => item._id !== id)
      );

      setMessage("Order deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete order.");
    } finally {
      setDeletingId("");
    }
  };

  const getTotal = (order) =>
    Number(
      order.totalPrice ??
      order.totalAmount ??
      order.total ??
      order.grandTotal ??
      0
    );

  const getCustomer = (order) =>
    order.customerName ||
    order.user?.name ||
    order.user?.fullName ||
    order.customer?.name ||
    "Customer";

  const getPhone = (order) =>
    order.customerPhone ||
    order.user?.phone ||
    order.customer?.phone ||
    order.phone ||
    "Not provided";

  const getOrderNumber = (order) =>
    order.orderNumber || order._id;

  const getStatusClass = (status) =>
    styles[String(status || "Pending").toLowerCase()] ||
    styles.pending;

  const pending = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const processing = orders.filter(
    (order) => order.status === "Processing"
  ).length;

  const completed = orders.filter(
    (order) => order.status === "Completed"
  ).length;

  const completedSales = orders
    .filter((order) => order.status === "Completed")
    .reduce((sum, order) => sum + getTotal(order), 0);

  return (
    <div className={styles.adminLayout}>
      <AdminNavigation />

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>Store Management</span>
            <h1>Orders</h1>
            <p>Manage customer orders and track their status.</p>
          </div>

          <button
            type="button"
            className={styles.refreshButton}
            onClick={loadOrders}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
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

        <section className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>📦</span>
            <p>Total Orders</p>
            <h2>{orders.length}</h2>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statIcon}>⏳</span>
            <p>Pending</p>
            <h2>{pending}</h2>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statIcon}>🔄</span>
            <p>Processing</p>
            <h2>{processing}</h2>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statIcon}>✅</span>
            <p>Completed</p>
            <h2>{completed}</h2>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statIcon}>💰</span>
            <p>Completed Sales</p>
            <h2>Rs. {completedSales.toLocaleString("en-LK")}</h2>
          </div>
        </section>

        <section className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div>
              <h2>All Orders</h2>
              <p>Live order records from your database.</p>
            </div>

            <span className={styles.orderCount}>
              {orders.length} orders
            </span>
          </div>

          {loading ? (
            <div className={styles.emptyState}>
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className={styles.emptyState}>
              <span>📭</span>
              <h3>No orders found</h3>
              <p>Customer orders will appear here after checkout.</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Update Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => {
                    const id = order._id;

                    return (
                      <tr key={id}>
                        <td className={styles.orderId}>
                          #{String(getOrderNumber(order)).slice(-8)}
                        </td>

                        <td>{getCustomer(order)}</td>

                        <td>{getPhone(order)}</td>

                        <td className={styles.total}>
                          Rs. {getTotal(order).toLocaleString("en-LK")}
                        </td>

                        <td>
                          <span className={getStatusClass(order.status)}>
                            {order.status || "Pending"}
                          </span>
                        </td>

                        <td>
                          <select
                            value={order.status || "Pending"}
                            disabled={
                              updatingId === id ||
                              deletingId === id
                            }
                            onChange={(event) =>
                              handleStatusChange(order, event.target.value)
                            }
                            aria-label={`Status for order ${id}`}
                          >
                            {STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>

                          {updatingId === id && (
                            <small className={styles.actionMessage}>
                              Updating...
                            </small>
                          )}
                        </td>

                        <td>
                          <button
                            type="button"
                            className={styles.deleteButton}
                            disabled={
                              deletingId === id ||
                              updatingId === id
                            }
                            onClick={() => handleDelete(order)}
                          >
                            {deletingId === id ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminOrders;