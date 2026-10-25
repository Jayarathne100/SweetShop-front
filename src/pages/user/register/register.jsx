
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  CakeSlice,
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  ArrowRight,
} from "lucide-react";

import styles from "./register.module.css";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      });

      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.registerCard}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <CakeSlice size={30} />
          </div>
          <span>SweetSpot</span>
        </div>

        <div className={styles.heading}>
          <span className={styles.eyebrow}>
            Your sweet journey starts here
          </span>
          <h1>Create Account</h1>
          <p>Join SweetSpot and discover your favourite treats.</p>
        </div>

        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="name">Full name</label>
          <div className={styles.inputGroup}>
            <UserRound size={19} />
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <label htmlFor="email">Email address</label>
          <div className={styles.inputGroup}>
            <Mail size={19} />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <label htmlFor="phone">Phone number <span>(optional)</span></label>
          <div className={styles.inputGroup}>
            <Phone size={19} />
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
            />
          </div>

          <label htmlFor="password">Password</label>
          <div className={styles.inputGroup}>
            <LockKeyhole size={19} />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.registerButton}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
            {!loading && <ArrowRight size={19} />}
          </button>
        </form>

        <p className={styles.loginText}>
          Already have an account?{" "}
          <Link to="/login" className={styles.link}>
            Sign in
          </Link>
        </p>

        <div className={styles.bottomNote}>
          Made with sweetness <span>♥</span>
        </div>
      </section>
    </main>
  );
};

export default Register;
