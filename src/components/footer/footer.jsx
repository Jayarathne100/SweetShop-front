
import React from "react";
import { Link } from "react-router-dom";
import {
  CakeSlice,
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
  Heart,
} from "lucide-react";
import styles from "./footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Brand */}
        <div className={styles.brandSection}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>
              <CakeSlice size={25} />
            </span>
            <span>
              Sweet<span className={styles.logoAccent}>Spot</span>
            </span>
          </Link>

          <p className={styles.description}>
            Delicious sweets, beautiful cakes, and refreshing
            drinks made with love. Make every moment a little
            sweeter with SweetSpot.
          </p>

          <div className={styles.brandTagline}>
            <Heart size={15} fill="currentColor" />
            <span>Made with love, served with sweetness</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.footerSection}>
          <h3>Quick Links</h3>
          <Link to="/" className={styles.footerLink}>
            Home <ArrowUpRight size={14} />
          </Link>
          <Link to="/products" className={styles.footerLink}>
            Sweets <ArrowUpRight size={14} />
          </Link>
          <Link to="/cakes" className={styles.footerLink}>
            Cakes <ArrowUpRight size={14} />
          </Link>
          <Link to="/drinks" className={styles.footerLink}>
            Cool Drinks <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Information */}
        <div className={styles.footerSection}>
          <h3>Information</h3>
          <Link to="/about" className={styles.footerLink}>
            About Us <ArrowUpRight size={14} />
          </Link>
          <Link to="/contact" className={styles.footerLink}>
            Contact Us <ArrowUpRight size={14} />
          </Link>
          <Link to="/login" className={styles.footerLink}>
            Login <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Contact */}
        <div className={styles.footerSection}>
          <h3>Get in Touch</h3>

          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>
              <MapPin size={17} />
            </span>
            <p>Matale, Sri Lanka</p>
          </div>

          <a
            href="tel:+94771234567"
            className={styles.contactItem}
          >
            <span className={styles.contactIcon}>
              <Phone size={17} />
            </span>
            <span>+94 77 123 4567</span>
          </a>

          <a
            href="mailto:info@sweetspot.com"
            className={styles.contactItem}
          >
            <span className={styles.contactIcon}>
              <Mail size={17} />
            </span>
            <span>info@sweetspot.com</span>
          </a>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className={styles.bottomFooter}>
        <p>
          © {new Date().getFullYear()} SweetSpot.
          All rights reserved.
        </p>

        <p className={styles.bottomMessage}>
          Sweet moments, made delicious.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
