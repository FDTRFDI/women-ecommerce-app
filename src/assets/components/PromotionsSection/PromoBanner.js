import React from "react";
import img from "../img/background/1.png";
import "./HeroBanner.css";

const PromoBanner = () => {
  return (
    <div className="hero-wrapper">
      <section className="hero-banner">
        <img src={img} alt="Promotional Banner" />

        <div className="hero-overlay">
          <h1>Discover The Best Deals</h1>
          <p>
            Shop the latest collections with exclusive discounts 
            and premium quality products.
          </p>
          <button>Explore Now</button>
        </div>
      </section>
    </div>
  );
};

export default PromoBanner;