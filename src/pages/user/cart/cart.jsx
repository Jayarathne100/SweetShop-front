
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ArrowLeft,
  Trash2,
  Minus,
  Plus,
  ShoppingCart,
  CreditCard,
  PackageCheck,
} from "lucide-react";

import { useCart } from "../../../context/CartContext";
import styles from "./cart.module.css";

const Cart = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
  } = useCart();

  const formatPrice = (price) =>
    `Rs. ${Number(price || 0).toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const totalItems = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  if (cartItems.length === 0) {
    return (
      <main className={styles.emptyPage}>
        <div className={styles.emptyCard}>
          <div className={styles.emptyIcon}>
            <ShoppingBag size={42} />
          </div>

          <h1>Your cart is waiting!</h1>

          <p>
            Your SweetSpot favourites will appear here.
            Explore our delicious sweets, cakes, and cool drinks.
          </p>

          <button
            className={styles.shopButton}
            onClick={() => navigate("/products")}
          >
            <ShoppingBag size={18} />
            Explore Sweets
          </button>

          <button
            className={styles.backButton}
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div>
            <span className={styles.eyebrow}>
              YOUR SWEET SELECTION
            </span>

            <h1>Shopping Cart</h1>

            <p>
              Review your treats before checking out.
            </p>
          </div>

          <div className={styles.itemBadge}>
            <ShoppingCart size={18} />
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </div>
        </div>

        <div className={styles.cartLayout}>
          {/* Cart Items */}
          <section className={styles.cartSection}>
            <div className={styles.sectionHeader}>
              <h2>Your Items</h2>

              <button
                className={styles.clearButton}
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to clear your cart?"
                    )
                  ) {
                    clearCart();
                  }
                }}
              >
                <Trash2 size={15} />
                Clear cart
              </button>
            </div>

            <div className={styles.items}>
              {cartItems.map((item) => {
                const imageUrl = item.image
                  ? item.image.startsWith("http")
                    ? item.image
                    : `http://localhost:3001${item.image}`
                  : null;

                return (
                  <article
                    className={styles.item}
                    key={item._id}
                  >
                    <div className={styles.productImage}>
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.name}
                        />
                      ) : (
                        <ShoppingBag size={32} />
                      )}
                    </div>

                    <div className={styles.productDetails}>
                      <h3>{item.name}</h3>

                      <p className={styles.unitPrice}>
                        {formatPrice(item.price)} each
                      </p>

                      <strong className={styles.mobilePrice}>
                        {formatPrice(
                          Number(item.price) * Number(item.quantity)
                        )}
                      </strong>

                      <div className={styles.quantityControl}>
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.name}`}
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            decreaseQuantity(item._id)
                          }
                        >
                          <Minus size={14} />
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.name}`}
                          onClick={() =>
                            increaseQuantity(item._id)
                          }
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div className={styles.itemEnd}>
                      <strong className={styles.desktopPrice}>
                        {formatPrice(
                          Number(item.price) * Number(item.quantity)
                        )}
                      </strong>

                      <button
                        className={styles.removeButton}
                        aria-label={`Remove ${item.name} from cart`}
                        onClick={() =>
                          removeFromCart(item._id)
                        }
                      >
                        <Trash2 size={17} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <button
              className={styles.continueButton}
              onClick={() => navigate("/products")}
            >
              <ArrowLeft size={17} />
              Continue Shopping
            </button>
          </section>

          {/* Order Summary */}
          <aside className={styles.summary}>
            <h2>Order Summary</h2>

            <div className={styles.summaryRow}>
              <span>Items ({totalItems})</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Delivery fee</span>
              <span className={styles.deliveryNote}>
                Calculated at checkout
              </span>
            </div>

            <div className={styles.summaryDivider} />

            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <strong>{formatPrice(cartTotal)}</strong>
            </div>

            <p className={styles.taxNote}>
              Delivery charges, if applicable, will be confirmed
              during checkout.
            </p>

            <button
              className={styles.checkoutButton}
              onClick={() => navigate("/checkout")}
            >
              <CreditCard size={19} />
              Proceed to Checkout
            </button>

            <div className={styles.secureNote}>
              <PackageCheck size={19} />

              <div>
                <strong>Freshness you can trust</strong>
                <p>Your SweetSpot order, prepared with care.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Cart;
