
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Candy,
  Search,
  RefreshCw,
  ShoppingBag,
  ArrowDownWideNarrow,
  Sparkles,
  Heart,
  Leaf,
  CheckCircle2,
} from "lucide-react";

import ProductCard from "../../../components/productCard/productCard";
import { getProducts } from "../../../services/productService";

import styles from "./products.module.css";

const Products = () => {
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
      console.error("Failed to load sweets:", err);
      setError("We couldn't load our sweets. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const sweets = useMemo(() => {
    let result = products.filter(
      (product) =>
        String(product.category || "").trim().toLowerCase() === "sweets"
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
        <div className={styles.heroPattern} aria-hidden="true" />

        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <Sparkles size={16} />
            <span>MADE FOR YOUR HAPPY MOMENTS</span>
          </div>

          <h1>
            Life Is Better
            <br />
            <span>With Something Sweet.</span>
          </h1>

          <p className={styles.heroDescription}>
            Discover little moments of happiness with our delightful
            collection of sweets. Find your favourites and make every
            day a little more special with SweetSpot.
          </p>

          <a className={styles.heroButton} href="#sweetsCollection">
            <ShoppingBag size={18} />
            Explore Our Sweets
          </a>

          <div className={styles.heroNote}>
            <Heart size={17} fill="currentColor" />
            <span>Sweet treats, lovely memories</span>
          </div>

          <div className={styles.heroFeatures}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>
                <Leaf size={17} />
              </span>
              <span>Made with care</span>
            </div>

            <div className={styles.feature}>
              <span className={styles.featureIcon}>
                <Heart size={17} />
              </span>
              <span>Made to delight</span>
            </div>
          </div>
        </div>

        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.heroOrbit} />

          <div className={styles.heroCircle}>
            <div className={styles.heroCandy}>
              <Candy size={108} strokeWidth={1.2} />
            </div>
            <span className={styles.circleText}>A SWEET LITTLE JOY</span>
          </div>

          <span className={styles.floatingHeart}>♥</span>
          <span className={styles.floatingSparkle}>✦</span>
          <span className={styles.floatingStar}>✧</span>
          <span className={styles.floatingDot} />
          <span className={styles.floatingDotTwo} />

          <div className={styles.floatingBadge}>
            <Heart size={17} fill="currentColor" />
            <div>
              <strong>Sweet moments</strong>
              <span>Start right here</span>
            </div>
          </div>
        </div>

        <div className={styles.heroBottomWave} aria-hidden="true" />
      </section>

      {/* Sweets Collection */}
      <section
        className={styles.collection}
        id="sweetsCollection"
      >
        <div className={styles.collectionHeader}>
          <div className={styles.collectionIntro}>
            <span className={styles.sectionLabel}>
              <span className={styles.labelDot} />
              THE SWEETSPOT COLLECTION
            </span>

            <h2>
              Explore Our <span>Sweets</span>
            </h2>

            <p>
              Your favourite treats are waiting to brighten your day.
            </p>
          </div>

          {!loading && !error && (
            <div className={styles.resultCount}>
              <Candy size={20} />
              <div>
                <strong>{sweets.length}</strong>
                <span>
                  {sweets.length === 1 ? "Sweet available" : "Sweets available"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Search and Sort */}
        <div className={styles.toolbar}>
          <label className={styles.searchBox}>
            <Search size={20} />

            <input
              type="search"
              placeholder="Search your favourite sweets..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search sweets by name"
            />

            {search && (
              <button
                type="button"
                className={styles.clearSearch}
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </label>

          <label className={styles.sortBox}>
            <ArrowDownWideNarrow size={19} />

            <span className={styles.sortLabel}>Sort by</span>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              aria-label="Sort sweets"
            >
              <option value="featured">Featured</option>
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </label>
        </div>

        {/* Active Search */}
        {search.trim() && !loading && !error && (
          <div className={styles.searchSummary}>
            <span>
              Showing results for <strong>"{search.trim()}"</strong>
            </span>

            <button
              type="button"
              onClick={() => setSearch("")}
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className={styles.stateContainer} role="status">
            <div className={styles.loader}>
              <Candy size={32} />
            </div>

            <h3>Preparing something sweet...</h3>

            <p>Just a little moment while we gather your favourite treats.</p>

            <div className={styles.skeletonGrid} aria-hidden="true">
              {[1, 2, 3, 4].map((item) => (
                <div className={styles.skeletonCard} key={item}>
                  <div className={styles.skeletonImage} />
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonShortLine} />
                  <div className={styles.skeletonButton} />
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
              type="button"
              className={styles.retryButton}
              onClick={loadProducts}
            >
              <RefreshCw size={17} />
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && sweets.length > 0 && (
          <>
            <div className={styles.grid}>
              {sweets.map((product) => (
                <div className={styles.productItem} key={product._id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <div className={styles.collectionFooter}>
              <span className={styles.footerIcon}>
                <CheckCircle2 size={17} />
              </span>
              <p>
                Every sweet moment begins with a little treat.
              </p>
              <Heart size={17} className={styles.footerHeart} />
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && sweets.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIllustration}>
              <Candy size={42} strokeWidth={1.4} />
              <span>♡</span>
            </div>

            <span className={styles.emptyEyebrow}>
              A LITTLE PAUSE IN THE SWEETNESS
            </span>

            <h3>
              {search.trim()
                ? "No matching sweets found"
                : "Our sweet shelf is waiting"}
            </h3>

            <p>
              {search.trim()
                ? "We couldn't find a sweet with that name. Try another search and discover something lovely."
                : "Our delicious treats will appear here when they're available."}
            </p>

            {search.trim() && (
              <button
                type="button"
                className={styles.retryButton}
                onClick={() => setSearch("")}
              >
                <Search size={17} />
                Explore All Sweets
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default Products;
