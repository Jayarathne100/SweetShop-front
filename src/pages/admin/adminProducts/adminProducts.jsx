import React, { useEffect, useState } from "react";
import AdminNavigation from "../../../components/AdminNavigation/AdminNavigation";
import { useAuth } from "../../../context/AuthContext";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../../services/productService";

import styles from "./adminProducts.module.css";

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "Sweets",
  stock: "0",
  isAvailable: true,
};

const API_BASE_URL = "http://localhost:5000";

const AdminProducts = () => {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${API_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();

      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      setError(err.message || "Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    setImageFile(file || null);
    setImagePreview("");

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Choose a JPG, PNG, or WEBP image.");
      event.target.value = "";
      setImageFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5 MB or less.");
      event.target.value = "";
      setImageFile(null);
      return;
    }

    setError("");
    setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setForm(initialForm);
    setImageFile(null);
    setImagePreview("");
    setEditingId(null);

    const fileInput = document.getElementById("productImage");

    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!token) {
      setError("Please log in as an administrator again.");
      return;
    }

    if (!form.name.trim()) {
      setError("Please enter the product name.");
      return;
    }

    if (form.price === "" || !Number.isFinite(Number(form.price)) ||
        Number(form.price) < 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) {
      setError("Stock must be a non-negative whole number.");
      return;
    }

    if (!editingId && !imageFile) {
      setError("Please select a product image.");
      return;
    }

    try {
      setSaving(true);

      const productData = {
        ...form,
        name: form.name.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        image: imageFile,
      };

      if (editingId) {
        await updateProduct(editingId, productData, token);
        setMessage("Product updated successfully!");
      } else {
        await createProduct(productData, token);
        setMessage("Product added successfully!");
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      setError(err.message || "Unable to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      category: product.category || "Sweets",
      stock: String(product.stock ?? 0),
      isAvailable: product.isAvailable ?? true,
    });

    setImageFile(null);
    setImagePreview(getImageUrl(product.image));
    setError("");
    setMessage("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await deleteProduct(id, token);

      if (editingId === id) {
        resetForm();
      }

      setMessage("Product deleted successfully!");
      await loadProducts();
    } catch (err) {
      setError(err.message || "Unable to delete product.");
    }
  };

  return (
    <div className={styles.adminLayout}>
      <AdminNavigation />

      <main className={styles.mainContent}>
        <header className={styles.pageHeader}>
          <div>
            <h1>Product Management</h1>
            <p>Add and manage SweetSpot products.</p>
          </div>
        </header>

        {error && (
          <div className={styles.errorMessage} role="alert">
            {error}
          </div>
        )}

        {message && (
          <div className={styles.successMessage} role="status">
            {message}
          </div>
        )}

        <section className={styles.formCard}>
          <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>

          <form onSubmit={handleSubmit} className={styles.productForm}>
            <div className={styles.formGroup}>
              <label htmlFor="productName">Product Name *</label>
              <input
                id="productName"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="productPrice">Price (LKR) *</label>
              <input
                id="productPrice"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="Enter price"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="productCategory">Category *</label>
              <select
                id="productCategory"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="Sweets">Sweets</option>
                <option value="Cakes">Cakes</option>
                <option value="Cool Drinks">Cool Drinks</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="productStock">Stock Quantity *</label>
              <input
                id="productStock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="productDescription">Description</label>
              <textarea
                id="productDescription"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your product"
                rows="4"
              />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="productImage">
                Product Image {editingId ? "(optional)" : "*"}
              </label>

              <input
                id="productImage"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                required={!editingId}
              />

              <small>JPG, PNG, or WEBP. Maximum file size: 5 MB.</small>

              {imagePreview && (
                <div className={styles.previewContainer}>
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className={styles.imagePreview}
                  />
                  <p>
                    {imageFile
                      ? "Selected image preview"
                      : "Current product image"}
                  </p>
                </div>
              )}
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                disabled={saving}
                className={styles.primaryButton}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Product"
                  : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section className={styles.listSection}>
          <div className={styles.listHeader}>
            <h2>All Products</h2>
            <span>{products.length} products</span>
          </div>

          {loading ? (
            <p className={styles.statusText}>Loading products...</p>
          ) : products.length === 0 ? (
            <p className={styles.statusText}>
              No products found. Add your first product above.
            </p>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.productTable}>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Availability</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        {product.image ? (
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className={styles.productImage}
                          />
                        ) : (
                          <span>No image</span>
                        )}
                      </td>

                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>
                        LKR {Number(product.price).toLocaleString("en-LK")}
                      </td>
                      <td>{product.stock ?? 0}</td>

                      <td>
                        <span
                          className={
                            product.isAvailable
                              ? styles.available
                              : styles.unavailable
                          }
                        >
                          {product.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </td>

                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            type="button"
                            onClick={() => handleEdit(product)}
                            className={styles.editButton}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(product._id)}
                            className={styles.deleteButton}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminProducts;