import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";

import styles from "./adminLogin.module.css";

const AdminLogin = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("admin@sweetspot.com");
  const [password, setPassword] = useState("Admin@12345");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);

      if (data.user.role !== "admin") {
        setError(
          "This account does not have admin access."
        );
        return;
      }

      navigate("/admin/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>

        {/* Logo */}
        <div className={styles.logo}>
          🍰
        </div>

        <h1>SweetSpot</h1>

        <h2>Admin Login</h2>

        <p className={styles.subtitle}>
          Sign in to access the administration panel
        </p>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className={styles.inputGroup}>
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Admin Email"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Password"
              required
            />
          </div>

          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Admin Login"}
          </button>
        </form>

        <button
          className={styles.backButton}
          onClick={() => navigate("/")}
          type="button"
        >
          ← Back to SweetSpot
        </button>

      </div>
    </div>
  );
};

export default AdminLogin;