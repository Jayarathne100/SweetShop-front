
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  GlassWater,
  Search,
  RefreshCw,
  ShoppingBag,
  ArrowDownWideNarrow,
  Sparkles,
  Droplets,
} from "lucide-react";

import ProductCard from "../../../components/productCard/productCard";
import { getProducts } from "../../../services/productService";

import styles from "./drinks.module.css";

const Drinks = () => {
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
      console.error("Failed to load drinks:", err);
      setError("We couldn't load our drinks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const drinks = useMemo(() => {
    let result = products.filter(
      (product) =>
        String(product.category || "").trim().toLowerCase() ===
        "cool drinks"
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
            <Droplets size={16} />
            SIP INTO SOMETHING REFRESHING
          </span>

          <h1>
            Refresh Your Day,
            <br />
            <span>One Sip at a Time.</span>
          </h1>

          <p>
            Discover refreshing cool drinks to brighten your day.
            Find your favourite flavours and enjoy every sip with SweetSpot.
          </p>

          <a className={styles.heroButton} href="#drinkCollection">
            <ShoppingBag size={18} />
            Explore Cool Drinks
          </a>

          <div className={styles.heroNote}>
            <Sparkles size={16} />
            A refreshing choice for every moment
          </div>
        </div>

        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.heroCircle}>
            <GlassWater size={112} strokeWidth={1.1} />
          </div>

          <span className={styles.floatingBubble}>○</span>
          <span className={styles.floatingSparkle}>✦</span>
          <span className={styles.floatingDrop}>●</span>
        </div>
      </section>

      {/* Drinks Collection */}
      <section
        className={styles.collection}
        id="drinkCollection"
      >
        <div className={styles.collectionHeader}>
          <div>
            <span className={styles.sectionLabel}>
              THE REFRESHMENT COLLECTION
            </span>

            <h2>Find Your Favourite Drink</h2>

            <p>
              From fruity flavours to refreshing everyday favourites.
            </p>
          </div>

          {!loading && !error && (
            <div className={styles.resultCount}>
              {drinks.length} {drinks.length === 1 ? "drink" : "drinks"}
            </div>
          )}
        </div>

        {/* Search and Sort */}
        <div className={styles.toolbar}>
          <label className={styles.searchBox}>
            <Search size={19} />

            <input
              type="search"
              placeholder="Search drinks..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search drinks by name"
            />
          </label>

          <label className={styles.sortBox}>
            <ArrowDownWideNarrow size={18} />

            <span>Sort by</span>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              aria-label="Sort drinks"
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
              <GlassWater size={30} />
            </div>

            <h3>Getting your refreshments ready...</h3>

            <p>Please wait while we load our cool drinks.</p>

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

            <h3>Unable to load drinks</h3>

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

        {/* Drinks Grid */}
        {!loading && !error && drinks.length > 0 && (
          <div className={styles.grid}>
            {drinks.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && drinks.length === 0 && (
          <div className={styles.stateContainer}>
            <div className={styles.stateIcon}>
              <GlassWater size={34} />
            </div>

            <h3>
              {search
                ? "No matching drinks found"
                : "No drinks available yet"}
            </h3>

            <p>
              {search
                ? "Try a different drink name to find your favourite."
                : "Our cool drinks will appear here when they're available."}
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

export default Drinks;
