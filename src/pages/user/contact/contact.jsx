
import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Sparkles,
  LoaderCircle,
} from "lucide-react";

import styles from "./contact.module.css";
import { sendMessage } from "../../../services/contactService";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await sendMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });

      setSuccess(
        result?.message || "Thank you! Your message has been sent."
      );

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError(err.message || "Failed to send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>
            <Sparkles size={15} />
            WE'RE HERE FOR YOU
          </span>

          <h1>
            Let's Start a <span>Sweet</span> Conversation
          </h1>

          <p>
            Have a question about our sweets, cakes, or refreshing drinks?
            Send us a message. We'd love to hear from you!
          </p>
        </div>

        <div className={styles.heroIcon} aria-hidden="true">
          <div className={styles.iconCircle}>
            <MessageCircle size={76} strokeWidth={1.4} />
          </div>
          <span className={styles.sparkleOne}>✦</span>
          <span className={styles.sparkleTwo}>✧</span>
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className={styles.info}>
          <span className={styles.sectionLabel}>CONTACT DETAILS</span>
          <h2>We'd Love to Hear From You</h2>
          <p className={styles.infoDescription}>
            Whether you need help with an order or want to know more about
            our products, we're happy to help.
          </p>

          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <MapPin size={21} />
              </div>
              <div>
                <h3>Our Location</h3>
                <p>Matale, Sri Lanka</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <Phone size={21} />
              </div>
              <div>
                <h3>Call Us</h3>
                <a href="tel:+94771234567">+94 77 123 4567</a>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <Mail size={21} />
              </div>
              <div>
                <h3>Email Us</h3>
                <a href="mailto:info@sweetspot.com">
                  info@sweetspot.com
                </a>
              </div>
            </div>
          </div>

          <div className={styles.hours}>
            <div className={styles.hoursHeading}>
              <Clock size={20} />
              <h3>Opening Hours</h3>
            </div>

            <div className={styles.hoursRow}>
              <span>Monday – Saturday</span>
              <span>9:00 AM – 8:00 PM</span>
            </div>

            <div className={styles.hoursRow}>
              <span>Sunday</span>
              <span>10:00 AM – 6:00 PM</span>
            </div>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formHeading}>
            <h2>Send Us a Message</h2>
            <p>Fill in the details below and we'll be in touch.</p>
          </div>

          <div className={styles.field}>
            <label htmlFor="contact-name">Your Name</label>
            <input
              id="contact-name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
              maxLength={100}
              disabled={loading}
              autoComplete="name"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="contact-email">Email Address</label>
            <input
              id="contact-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              maxLength={254}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="contact-subject">Subject</label>
            <input
              id="contact-subject"
              type="text"
              name="subject"
              placeholder="What would you like to ask?"
              value={form.subject}
              onChange={handleChange}
              required
              maxLength={150}
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="contact-message">Your Message</label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="Write your message here..."
              rows={5}
              value={form.message}
              onChange={handleChange}
              required
              maxLength={3000}
              disabled={loading}
            />
            <span className={styles.characterCount}>
              {form.message.length}/3000 characters
            </span>
          </div>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className={styles.success} role="status">
              {success}
            </p>
          )}

          <button
            className={styles.submitButton}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoaderCircle className={styles.spinner} size={18} />
                Sending Message...
              </>
            ) : (
              <>
                <Send size={17} />
                Send Message
              </>
            )}
          </button>

          <p className={styles.formNote}>
            <Sparkles size={14} />
            Thank you for getting in touch with SweetSpot.
          </p>
        </form>
      </section>
    </main>
  );
};

export default Contact;
