
import React, { useCallback, useEffect, useState } from "react";
import styles from "./adminMessages.module.css";

import { useAuth } from "../../../context/AuthContext";
import AdminNavigation from "../../../components/AdminNavigation/AdminNavigation";

import {
  getMessages,
  markMessageAsRead,
  deleteMessage as deleteMessageRequest,
} from "../../../services/contactService";

const AdminMessages = () => {
  const { token } = useAuth();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const loadMessages = useCallback(async () => {
    if (!token) {
      setMessages([]);
      setLoading(false);
      setError("Please log in as an administrator.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getMessages(token);

      setMessages(
        Array.isArray(data.messages) ? data.messages : []
      );
    } catch (err) {
      setError(err.message || "Unable to load messages.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const markAsRead = async (id) => {
    try {
      setError("");
      setSuccess("");

      await markMessageAsRead(id, token);

      setMessages((previous) =>
        previous.map((message) =>
          message._id === id
            ? { ...message, status: "Read" }
            : message
        )
      );

      setSuccess("Message marked as read.");
    } catch (err) {
      setError(err.message || "Failed to update message.");
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this message?"
      )
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteMessageRequest(id, token);

      setMessages((previous) =>
        previous.filter((message) => message._id !== id)
      );

      setSuccess("Message deleted successfully.");
    } catch (err) {
      setError(err.message || "Failed to delete message.");
    }
  };

  const unreadCount = messages.filter(
    (message) => message.status === "Unread"
  ).length;

  const filteredMessages = messages.filter((message) => {
    const searchText = search.trim().toLowerCase();

    return [
      message.name,
      message.email,
      message.subject,
      message.message,
      message.status,
    ].some((value) =>
      String(value || "").toLowerCase().includes(searchText)
    );
  });

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString();
  };

  return (
    <div className={styles.adminLayout}>
      <AdminNavigation />

      <main className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <span className={styles.eyebrow}>
              CUSTOMER COMMUNICATION
            </span>

            <h1>Messages</h1>

            <p>
              View and manage messages sent by SweetSpot customers.
            </p>
          </div>

          <button
            type="button"
            onClick={loadMessages}
            disabled={loading}
            className={styles.refresh}
          >
            <span aria-hidden="true">↻</span>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </header>

        <section className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>💬</div>

            <div className={styles.statInfo}>
              <p>Total Messages</p>
              <h2>{messages.length}</h2>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>📩</div>

            <div className={styles.statInfo}>
              <p>Unread Messages</p>
              <h2>{unreadCount}</h2>
            </div>
          </div>
        </section>

        <section className={styles.content}>
          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <span aria-hidden="true">⌕</span>

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search messages..."
                aria-label="Search messages"
              />
            </div>

            <span className={styles.resultCount}>
              {filteredMessages.length}{" "}
              {filteredMessages.length === 1
                ? "message"
                : "messages"}
            </span>
          </div>

          {error && (
            <div className={styles.error} role="alert">
              <span>⚠</span>
              {error}
            </div>
          )}

          {success && (
            <div className={styles.success} role="status">
              <span>✓</span>
              {success}
            </div>
          )}

          {loading ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>⏳</span>
              <h3>Loading messages</h3>
              <p>Please wait while messages are retrieved.</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>✉</span>

              <h3>
                {search
                  ? "No matching messages"
                  : "No messages yet"}
              </h3>

              <p>
                {search
                  ? "Try searching with a different name, email, or keyword."
                  : "Customer messages will appear here when received."}
              </p>
            </div>
          ) : (
            <section className={styles.messages}>
              {filteredMessages.map((message) => (
                <article
                  className={`${styles.messageCard} ${
                    message.status !== "Read"
                      ? styles.unread
                      : ""
                  }`}
                  key={message._id}
                >
                  <div className={styles.messageHeader}>
                    <div className={styles.customerInfo}>
                      <div className={styles.customerNameRow}>
                        <h3>{message.name || "Unknown customer"}</h3>

                        {message.status !== "Read" && (
                          <span className={styles.unreadDot} />
                        )}
                      </div>

                      <a
                        className={styles.email}
                        href={`mailto:${message.email}`}
                      >
                        {message.email}
                      </a>

                      {message.subject && (
                        <p className={styles.subject}>
                          <strong>Subject:</strong>{" "}
                          {message.subject}
                        </p>
                      )}
                    </div>

                    <div className={styles.messageMeta}>
                      <span className={styles.date}>
                        {formatDate(message.createdAt)}
                      </span>

                      <span
                        className={`${styles.statusBadge} ${
                          message.status === "Read"
                            ? styles.readBadge
                            : styles.unreadBadge
                        }`}
                      >
                        {message.status || "Unread"}
                      </span>
                    </div>
                  </div>

                  <div className={styles.messageBody}>
                    <p className={styles.message}>
                      {message.message}
                    </p>
                  </div>

                  <div className={styles.actions}>
                    {message.status !== "Read" && (
                      <button
                        type="button"
                        className={styles.read}
                        onClick={() => markAsRead(message._id)}
                      >
                        <span aria-hidden="true">✓</span>
                        Mark as Read
                      </button>
                    )}

                    <button
                      type="button"
                      className={styles.delete}
                      onClick={() => handleDelete(message._id)}
                    >
                      <span aria-hidden="true">×</span>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </section>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminMessages;
