
import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import styles from "./productCard.module.css";

const API_URL = "http://localhost:3001";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  // Support common image field names.
  const imagePath =
    product.image ||
    product.imageUrl ||
    product.imageURL ||
    (Array.isArray(product.images) ? product.images[0] : "");

  // Handle full URLs and relative upload paths.
  const imageSrc = imagePath
    ? /^https?:\/\//i.test(imagePath)
      ? imagePath
      : `${API_URL}/${String(imagePath).replace(/^\/+/, "")}`
    : "";

  const price = Number(product.price) || 0;
  const stock = Number(product.stock) || 0;
  const isAvailable = product.isAvailable !== false;

  const handleAddToCart = () => {
    if (stock <= 0 || !isAvailable) return;
    addToCart(product);
  };

  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        {imageSrc && !imageError ? (
          <img
            src={imageSrc}
            alt={product.name || "SweetSpot product"}
            loading="lazy"
            onError={() => {
              console.error("Failed to load product image:", imageSrc);
              setImageError(true);
            }}
          />
        ) : (
          <div className={styles.noImage}>
            <span>🍰</span>
            <p>Image unavailable</p>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h3>{product.name || "Unnamed product"}</h3>

        <p>{product.description || "A delicious SweetSpot treat."}</p>

        <h4>Rs. {price.toLocaleString("en-LK")}</h4>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={stock <= 0 || !isAvailable}
        >
          {stock <= 0 || !isAvailable
            ? "Out of Stock"
            : "Add to Cart"}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
