import React, { useCallback, useEffect, useState } from "react";
import AdminNavigation from "../../../components/AdminNavigation/AdminNavigation";
import { useAuth } from "../../../context/AuthContext";
import { getDashboardStats } from "../../../services/adminService";
import styles from "./dashboard.module.css";

const Dashboard = () => {
  const { token } = useAuth();

  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    totalSales: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = useCallback(async () => {
    if (!token) {
      setError("Please log in as an administrator.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getDashboardStats(token);

      console.log("Dashboard API response:", response);

      const data = response?.stats ?? response?.data ?? response;

      setStats({
        users: Number(data?.users ?? data?.totalUsers ?? 0),
        products: Number(data?.products ?? data?.totalProducts ?? 0),
        orders: Number(data?.orders ?? data?.totalOrders ?? 0),
        totalSales: Number(data?.totalSales ?? data?.sales ?? 0),
      });
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError(err.message || "Unable to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const formatNumber = (value) =>
    Number(value || 0).toLocaleString("en-LK");

  const formatCurrency = (value) =>
    `Rs. ${Number(value || 0).toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const cards = [
    {
      title: "Total Users",
      value: formatNumber(stats.users),
      icon: "👥",
      className: styles.usersIcon,
    },
    {
      title: "Total Products",
      value: formatNumber(stats.products),
      icon: "🍰",
      className: styles.productsIcon,
    },
    {
      title: "Total Orders",
      value: formatNumber(stats.orders),
      icon: "📦",
      className: styles.ordersIcon,
    },
    {
      title: "Total Sales",
      value: formatCurrency(stats.totalSales),
      icon: "💰",
      className: styles.salesIcon,
    },
  ];

  return (
    <div className={styles.adminLayout}>
      <AdminNavigation />

      <main className={styles.content}>
        <header className={styles.pageHeader}>
          <div>
            <span className={styles.eyebrow}>
              SWEETSPOT MANAGEMENT
            </span>

            <h1>Dashboard</h1>

            <p>
              Welcome to the SweetSpot Admin Panel.
              Manage your shop from one place.
            </p>
          </div>

          <button
            type="button"
            className={styles.refreshButton}
            onClick={loadStats}
            disabled={loading}
          >
            {loading ? "Loading..." : "↻ Refresh"}
          </button>
        </header>

        {error && (
          <div className={styles.error} role="alert">
            <p>{error}</p>

            <button
              type="button"
              onClick={loadStats}
              disabled={loading}
            >
              Try Again
            </button>
          </div>
        )}

        {loading ? (
          <div className={styles.loading}>
            <p>Loading dashboard statistics...</p>
          </div>
        ) : (
          <>
            <section className={styles.statsGrid}>
              {cards.map((card) => (
                <article
                  className={styles.statCard}
                  key={card.title}
                >
                  <div
                    className={`${styles.icon} ${card.className}`}
                  >
                    {card.icon}
                  </div>

                  <div className={styles.statInfo}>
                    <span>{card.title}</span>
                    <h2>{card.value}</h2>
                  </div>
                </article>
              ))}
            </section>

            <section className={styles.welcomeCard}>
              <div className={styles.welcomeIcon}>🍰</div>

              <div>
                <h2>Welcome to SweetSpot Admin</h2>
                <p>
                  Manage products, monitor orders, review customers,
                  and track your shop's sales.
                </p>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;