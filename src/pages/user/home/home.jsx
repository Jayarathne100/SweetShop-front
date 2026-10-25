
import React from "react";
import { Link } from "react-router-dom";
import {
  Candy,
  CakeSlice,
  GlassWater,
  Heart,
  Sparkles,
  ShoppingBag,
  Truck,
  ArrowRight,
  Leaf,
  Star,
} from "lucide-react";

import styles from "./home.module.css";

const Home = () => {
  const categories = [
    {
      title: "Sweet Treats",
      description: "Little bites of happiness for every craving.",
      icon: Candy,
      path: "/products",
      label: "Explore Sweets",
      className: "sweet",
    },
    {
      title: "Beautiful Cakes",
      description: "Make your celebrations a little more special.",
      icon: CakeSlice,
      path: "/cakes",
      label: "Explore Cakes",
      className: "cake",
    },
    {
      title: "Cool Drinks",
      description: "Refreshing sips to brighten your day.",
      icon: GlassWater,
      path: "/drinks",
      label: "Explore Drinks",
      className: "drink",
    },
  ];

  const features = [
    {
      icon: CakeSlice,
      title: "Quality Products",
      description:
        "Discover delicious treats selected to make your moments special.",
    },
    {
      icon: Heart,
      title: "Made With Care",
      description:
        "We believe every little detail makes your experience sweeter.",
    },
    {
      icon: ShoppingBag,
      title: "Easy Ordering",
      description:
        "Browse our collection and add your favourite treats to your cart.",
    },
    {
      icon: Truck,
      title: "Convenient Shopping",
      description:
        "Enjoy a simple shopping experience from browsing to checkout.",
    },
  ];

  return (
    <main className={styles.home}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.subtitle}>
            <Sparkles size={15} />
            WELCOME TO SWEETSPOT
          </span>

          <h1>
            Sweet Moments,
            <br />
            <span>Made Delicious.</span>
          </h1>

          <p>
            Discover delightful sweets, beautiful cakes, and refreshing
            drinks. Find your favourite treats and make every moment
            a little sweeter.
          </p>

          <div className={styles.buttons}>
            <Link to="/products" className={styles.primaryButton}>
              <ShoppingBag size={17} />
              Shop Now
              <ArrowRight size={16} />
            </Link>

            <Link to="/cakes" className={styles.secondaryButton}>
              Explore Cakes
            </Link>
          </div>

          <div className={styles.heroNote}>
            <Leaf size={17} />
            A little sweetness for every occasion
          </div>
        </div>

        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.heroCircle}>
            <CakeSlice size={112} strokeWidth={1.25} />
          </div>

          <div className={styles.floatingBadge}>
            <Star size={15} fill="currentColor" />
            Made for sweet moments
          </div>

          <span className={styles.sparkleOne}>✦</span>
          <span className={styles.sparkleTwo}>✧</span>
          <span className={styles.floatingHeart}>♥</span>
        </div>
      </section>

      {/* Categories */}
      <section className={styles.categories}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionLabel}>FIND YOUR FAVOURITE</span>
          <h2>Explore Our Categories</h2>
          <p>
            Something sweet, something special, something just for you.
          </p>
        </div>

        <div className={styles.categoryGrid}>
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                to={category.path}
                className={`${styles.categoryCard} ${styles[category.className]}`}
                key={category.title}
              >
                <div className={styles.categoryIcon}>
                  <Icon size={34} strokeWidth={1.6} />
                </div>

                <h3>{category.title}</h3>
                <p>{category.description}</p>

                <span className={styles.categoryLink}>
                  {category.label}
                  <ArrowRight size={16} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why choose SweetSpot */}
      <section className={styles.features}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionLabel}>THE SWEETSPOT EXPERIENCE</span>
          <h2>A Little More to Love</h2>
          <p>
            We want discovering your next favourite treat to be easy
            and enjoyable.
          </p>
        </div>

        <div className={styles.featureGrid}>
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article className={styles.feature} key={feature.title}>
                <div className={styles.featureIcon}>
                  <Icon size={25} strokeWidth={1.7} />
                </div>

                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Shopping banner */}
      <section className={styles.cta}>
        <div className={styles.ctaIcon}>
          <Sparkles size={30} />
        </div>

        <div className={styles.ctaContent}>
          <span className={styles.sectionLabel}>YOUR NEXT FAVOURITE TREAT</span>
          <h2>Ready for Something Sweet?</h2>
          <p>Explore the collection and find a little happiness today.</p>
        </div>

        <Link to="/products" className={styles.ctaButton}>
          Discover Treats
          <ArrowRight size={17} />
        </Link>
      </section>
    </main>
  );
};

export default Home;
