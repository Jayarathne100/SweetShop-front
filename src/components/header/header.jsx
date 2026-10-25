
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CakeSlice,
  ShoppingCart,
  UserRound,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Candy,
  GlassWater,
  Info,
  Mail,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import styles from "./header.module.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();

  const [menuOpen, setMenuOpen] = React.useState(false);

  const navItems = [
    { label: "Sweets", path: "/products", icon: Candy },
    { label: "Cakes", path: "/cakes", icon: CakeSlice },
    { label: "Cool Drinks", path: "/drinks", icon: GlassWater },
    { label: "About", path: "/about", icon: Info },
    { label: "Contact", path: "/contact", icon: Mail },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Logo */}
        <button
          type="button"
          className={styles.logo}
          onClick={() => handleNavigate("/")}
          aria-label="SweetSpot home"
        >
          <span className={styles.logoIcon}>
            <CakeSlice size={25} />
          </span>

          <span className={styles.logoText}>
            Sweet<span>Spot</span>
          </span>
        </button>

        {/* Desktop navigation */}
        <nav className={styles.navigation} aria-label="Main navigation">
          {navItems.map(({ label, path, icon: Icon }) => (
            <button
              type="button"
              key={path}
              className={`${styles.navLink} ${
                isActive(path) ? styles.activeLink : ""
              }`}
              onClick={() => handleNavigate(path)}
              aria-current={isActive(path) ? "page" : undefined}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          {isAuthenticated ? (
            <>
              <span className={styles.greeting}>
                <UserRound size={17} />
                <span>Hi, {user?.name || "User"}</span>
              </span>

              <button
                type="button"
                className={styles.cartButton}
                onClick={() => handleNavigate("/cart")}
                aria-label={`Shopping cart with ${cartCount} items`}
              >
                <ShoppingCart size={19} />
                <span>Cart</span>
                <span className={styles.cartBadge}>{cartCount}</span>
              </button>

              {isAdmin && (
                <button
                  type="button"
                  className={styles.adminButton}
                  onClick={() => handleNavigate("/admin/dashboard")}
                >
                  <LayoutDashboard size={17} />
                  <span>Admin</span>
                </button>
              )}

              <button
                type="button"
                className={styles.logoutButton}
                onClick={handleLogout}
              >
                <LogOut size={17} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              className={styles.loginButton}
              onClick={() => handleNavigate("/login")}
            >
              <UserRound size={17} />
              Login
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className={styles.menuToggle}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navItems.map(({ label, path, icon: Icon }) => (
            <button
              type="button"
              key={path}
              className={`${styles.mobileNavLink} ${
                isActive(path) ? styles.activeLink : ""
              }`}
              onClick={() => handleNavigate(path)}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}

          {isAuthenticated ? (
            <>
              <button
                type="button"
                className={styles.mobileNavLink}
                onClick={() => handleNavigate("/cart")}
              >
                <ShoppingCart size={18} />
                Cart ({cartCount})
              </button>

              {isAdmin && (
                <button
                  type="button"
                  className={styles.mobileNavLink}
                  onClick={() => handleNavigate("/admin/dashboard")}
                >
                  <LayoutDashboard size={18} />
                  Admin Dashboard
                </button>
              )}

              <button
                type="button"
                className={styles.mobileNavLink}
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              className={styles.mobileLogin}
              onClick={() => handleNavigate("/login")}
            >
              <UserRound size={18} />
              Login
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
