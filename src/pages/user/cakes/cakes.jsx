
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CakeSlice,
  Search,
  RefreshCw,
  Heart,
  ArrowDownWideNarrow,
  ShoppingBag,
} from "lucide-react";

import ProductCard from "../../../components/productCard/productCard";
import { getProducts } from "../../../services/productService";

import styles from "./cakes.module.css";

const Cakes = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getProducts();

      const productList = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
          ? data.products
          : [];

      setProducts(productList);
    } catch (err) {
      console.error("Failed to load cakes:", err);
      setError("We couldn't load our cakes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const cakes = useMemo(() => {
    let result = products.filter(
      (product) =>
        String(product.category || "").trim().toLowerCase() === "cakes"
    );

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((product) =>
        String(product.name || "").toLowerCase().includes(query)
      );
    }

    if (sortBy === "price-low") {
      result.sort(
        (a, b) => Number(a.price || 0) - Number(b.price || 0)
      );
    } else if (sortBy === "price-high") {
      result.sort(
        (a, b) => Number(b.price || 0) - Number(a.price || 0)
      );
    } else if (sortBy === "name") {
      result.sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || ""))
      );
    }

    return result;
  }, [products, search, sortBy]);

  return (
    <main className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>
            <CakeSlice size={16} />
            BAKED WITH LOVE
          </span>

          <h1>
            A Little Slice
            <br />
            <span>of Happiness.</span>
          </h1>

          <p>
            Celebrate life's sweetest moments with delicious cakes
            made to bring a smile to every occasion.
          </p>

          <a className={styles.heroButton} href="#cakeCollection">
            <ShoppingBag size={18} />
            Explore Our Cakes
          </a>

          <div className={styles.heroNote}>
            <Heart size={16} fill="currentColor" />
            Made for your sweetest moments
          </div>
        </div>

        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.heroCircle}>
            <CakeSlice size={112} strokeWidth={1.1} />
          </div>
          <span className={styles.floatingHeart}>♥</span>
          <span className={styles.floatingSparkle}>✦</span>
          <span className={styles.floatingDot}>•</span>
        </div>
      </section>

      {/* Cake Collection */}
      <section
        className={styles.collection}
        id="cakeCollection"
      >
        <div className={styles.collectionHeader}>
          <div>
            <span className={styles.sectionLabel}>
              OUR BAKERY COLLECTION
            </span>
            <h2>Discover Our Cakes</h2>
            <p>
              Find your favourite flavour for every celebration.
            </p>
          </div>

          {!loading && !error && (
            <div className={styles.resultCount}>
              {cakes.length} {cakes.length === 1 ? "cake" : "cakes"}
            </div>
          )}
        </div>

        {/* Search and Sort */}
        <div className={styles.toolbar}>
          <label className={styles.searchBox}>
            <Search size={19} />
            <input
              type="search"
              placeholder="Search cakes..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search cakes by name"
            />
          </label>

          <label className={styles.sortBox}>
            <ArrowDownWideNarrow size={18} />
            <span>Sort by</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              aria-label="Sort cakes"
            >
              <option value="featured">Featured</option>
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </label>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={styles.stateContainer} role="status">
            <div className={styles.loader}>
              <CakeSlice size={30} />
            </div>
            <h3>Preparing something sweet...</h3>
            <p>We're bringing our delicious cakes to you.</p>

            <div className={styles.skeletonGrid} aria-hidden="true">
              {[1, 2, 3, 4].map((item) => (
                <div className={styles.skeletonCard} key={item}>
                  <div className={styles.skeletonImage} />
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonShortLine} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className={styles.stateContainer}>
            <div className={styles.stateIcon}>
              <RefreshCw size={30} />
            </div>
            <h3>Oops! Something went wrong.</h3>
            <p>{error}</p>
            <button
              className={styles.retryButton}
              onClick={loadProducts}
            >
              <RefreshCw size={17} />
              Try Again
            </button>
          </div>
        )}

        {/* Products */}
        {!loading && !error && cakes.length > 0 && (
          <div className={styles.grid}>
            {cakes.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && cakes.length === 0 && (
          <div className={styles.stateContainer}>
            <div className={styles.stateIcon}>
              <CakeSlice size={34} />
            </div>

            <h3>
              {search
                ? "No matching cakes found"
                : "Our cake shelf is empty"}
            </h3>

            <p>
              {search
                ? "Try another cake name to find what you're craving."
                : "Our delicious cakes will be available here soon."}
            </p>

            {search && (
              <button
                className={styles.retryButton}
                onClick={() => setSearch("")}
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default Cakes;
