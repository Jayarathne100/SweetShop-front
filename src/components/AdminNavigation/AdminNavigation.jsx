import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import styles from "./AdminNavigation.module.css";

const AdminNavigation = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: "📊",
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: "🍰",
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: "📦",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "👥",
    },
    {
      name: "Messages",
      path: "/admin/messages",
      icon: "💬",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const adminName = user?.name || user?.username || "Administrator";

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>🍰</div>

        <div className={styles.logoText}>
          <h2>SweetSpot</h2>
          <span>Admin Panel</span>
        </div>
      </div>

      {/* Administrator Information */}
      <div className={styles.adminInfo}>
        <div className={styles.avatar}>
          {adminName.charAt(0).toUpperCase()}
        </div>

        <div className={styles.adminDetails}>
          <strong>{adminName}</strong>
          <span>Administrator</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className={styles.navigation}>
        <p className={styles.sectionTitle}>MAIN MENU</p>

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `${styles.navItem} ${
                isActive ? styles.active : ""
              }`
            }
          >
            <span className={styles.icon}>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className={styles.bottomSection}>
        <button
          type="button"
          className={styles.homeButton}
          onClick={() => navigate("/")}
        >
          <span>🏠</span>
          <span>View Store</span>
        </button>

        <button
          type="button"
          className={styles.logoutButton}
          onClick={handleLogout}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminNavigation;
