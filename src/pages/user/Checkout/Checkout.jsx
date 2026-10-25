import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import { createOrder } from "../../../services/orderService";

import styles from "./checkout.module.css";

const Checkout = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customerName: user?.name || "",
    phone: user?.phone || "",
    address: "",
    paymentMethod: "Cash on Delivery",
  });

  // Demo-only card fields. Never send these to your backend.
  const [cardData, setCardData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;

    setCardData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    // Card fields are only a visual demo; no payment is processed.
    if (formData.paymentMethod === "Card") {
      setError(
        "Card payment is not connected yet. Please select Cash on Delivery or integrate a secure payment provider."
      );
      return;
    }

    if (!token) {
      navigate("/login", {
        state: { from: "/checkout" },
      });
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        items: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        paymentMethod: formData.paymentMethod,
      };

      await createOrder(orderData, token);

      clearCart();
      alert("Order placed successfully!");
      navigate("/");
    } catch (err) {
      setError(err.message || "Unable to place your order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.checkoutPage}>
      <div className={styles.checkoutWrapper}>
        <div className={styles.pageHeading}>
          <span className={styles.eyebrow}>SWEETSPOT BAKERY</span>
          <h1>Checkout</h1>
          <p>Almost there! Confirm your delivery details.</p>
        </div>

        <div className={styles.checkoutGrid}>
          <section className={styles.formCard}>
            <h2>Delivery Information</h2>

            {error && (
              <div className={styles.errorMessage} role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label htmlFor="customerName">Full name</label>
                <input
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="phone">Phone number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="address">Delivery address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your complete delivery address"
                  autoComplete="street-address"
                  rows={4}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="paymentMethod">Payment method</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="Cash on Delivery">
                    Cash on Delivery
                  </option>
                  <option value="Card">Credit / Debit Card</option>
                  <option value="Online">Online Payment</option>
                </select>
              </div>

              {formData.paymentMethod === "Card" && (
                <div className={styles.cardDemo}>
                  <h3>Card payment</h3>
                  <p className={styles.demoNotice}>
                    Demo only — card payment is not connected.
                    Do not enter real card details.
                  </p>

                  <div className={styles.field}>
                    <label htmlFor="cardholderName">Cardholder name</label>
                    <input
                      id="cardholderName"
                      name="cardholderName"
                      value={cardData.cardholderName}
                      onChange={handleCardChange}
                      placeholder="Name on card"
                      autoComplete="off"
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="cardNumber">Card number</label>
                    <input
                      id="cardNumber"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleCardChange}
                      placeholder="Demo field only"
                      inputMode="numeric"
                      autoComplete="off"
                    />
                  </div>

                  <div className={styles.cardFieldsRow}>
                    <div className={styles.field}>
                      <label htmlFor="expiry">Expiry date</label>
                      <input
                        id="expiry"
                        name="expiry"
                        value={cardData.expiry}
                        onChange={handleCardChange}
                        placeholder="MM/YY"
                        autoComplete="off"
                      />
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="cvv">Security code</label>
                      <input
                        id="cvv"
                        name="cvv"
                        value={cardData.cvv}
                        onChange={handleCardChange}
                        placeholder="Demo only"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={styles.placeOrderButton}
                disabled={loading || cartItems.length === 0}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>

              <button
                type="button"
                className={styles.backButton}
                onClick={() => navigate("/cart")}
              >
                Back to Cart
              </button>
            </form>
          </section>

          <aside className={styles.summaryCard}>
            <h2>Your Order</h2>

            <div className={styles.orderItems}>
              {cartItems.map((item) => (
                <div className={styles.orderItem} key={item._id}>
                  <div className={styles.itemDetails}>
                    <span>{item.name}</span>
                    <small>Quantity: {item.quantity}</small>
                  </div>

                  <strong>
                    Rs.{" "}
                    {(
                      Number(item.price) * Number(item.quantity)
                    ).toLocaleString()}
                  </strong>
                </div>
              ))}
            </div>

            <div className={styles.totalRow}>
              <span>Total</span>
              <strong>Rs. {cartTotal.toLocaleString()}</strong>
            </div>

            <p className={styles.secureNote}>
              Your order details will be sent securely to the SweetSpot
              backend. Card payments require a separate payment provider.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Checkout;