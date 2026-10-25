
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Mail, LockKeyhole, CakeSlice, ArrowRight } from "lucide-react";

import styles from "./login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email.trim(), password);

      if (data?.user?.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.loginCard}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <CakeSlice size={30} />
          </div>
          <span>SweetSpot</span>
        </div>

        <div className={styles.heading}>
          <span className={styles.eyebrow}>A little sweetness awaits</span>
          <h1>Welcome back!</h1>
          <p>Sign in to enjoy your favourite treats.</p>
        </div>

        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="email">Email address</label>
          <div className={styles.inputGroup}>
            <Mail size={19} />
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <label htmlFor="password">Password</label>
          <div className={styles.inputGroup}>
            <LockKeyhole size={19} />
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <ArrowRight size={19} />}
          </button>
        </form>

        <p className={styles.registerText}>
          Don't have an account?{" "}
          <Link to="/register" className={styles.link}>
            Create an account
          </Link>
        </p>

        <div className={styles.bottomNote}>
          Made with sweetness <span>♥</span>
        </div>
      </section>
    </main>
  );
};

export default Login;
