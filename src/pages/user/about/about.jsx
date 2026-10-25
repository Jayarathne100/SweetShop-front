
import React from "react";
import {
  Heart,
  Target,
  CakeSlice,
  Sparkles,
  ArrowRight,
  Leaf,
} from "lucide-react";
import styles from "./about.module.css";

const About = () => {
  const features = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To provide delicious, quality products and make every customer's ordering experience simple and enjoyable.",
    },
    {
      icon: Heart,
      title: "Our Values",
      description:
        "Quality, freshness, customer satisfaction, and passion guide everything we do.",
    },
    {
      icon: CakeSlice,
      title: "Our Products",
      description:
        "Discover delightful sweets, beautiful cakes, and refreshing drinks for everyday moments and special occasions.",
    },
  ];

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>
            <Sparkles size={15} />
            ABOUT SWEETSPOT
          </span>

          <h1>
            Making Every Moment <span>Sweeter</span>
          </h1>

          <p>
            Welcome to SweetSpot, your happy place for delicious sweets,
            beautiful cakes, and refreshing drinks. We believe life's
            little moments deserve something special.
          </p>

          <a href="/products" className={styles.heroButton}>
            Explore Our Collection
            <ArrowRight size={17} />
          </a>

          <div className={styles.heroNote}>
            <Leaf size={17} />
            Made for life's little sweet moments
          </div>
        </div>

        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.circle}>
            <CakeSlice size={105} strokeWidth={1.2} />
          </div>
          <span className={styles.sparkleOne}>✦</span>
          <span className={styles.sparkleTwo}>✧</span>
          <span className={styles.heart}>♥</span>
        </div>
      </section>

      <section className={styles.intro}>
        <span className={styles.sectionLabel}>GET TO KNOW US</span>
        <h2>A Little Sweetness Goes a Long Way</h2>
        <p>
          At SweetSpot, we bring together the treats you love and a
          convenient way to discover and order them. Whether you are
          celebrating a special day or simply treating yourself, we are
          here to make your experience enjoyable.
        </p>
      </section>

      <section className={styles.content}>
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <article className={styles.card} key={feature.title}>
              <div className={styles.cardIcon}>
                <Icon size={27} strokeWidth={1.8} />
              </div>

              <span className={styles.cardNumber}>
                0{index + 1}
              </span>

              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </article>
          );
        })}
      </section>

      <section className={styles.bottomBanner}>
        <div>
          <span className={styles.sectionLabel}>YOUR NEXT FAVOURITE TREAT</span>
          <h2>Ready for Something Sweet?</h2>
          <p>Explore our collection and find a little happiness today.</p>
        </div>

        <a href="/products" className={styles.bannerButton}>
          Shop Now <ArrowRight size={17} />
        </a>
      </section>
    </main>
  );
};

export default About;
