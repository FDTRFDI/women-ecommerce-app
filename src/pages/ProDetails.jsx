import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import API from "../src/config/api";
import "./ProDetails.css";

const ProDetails = () => {
  const { id } = useParams();

  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setProduct(null);
    setCurrent(0);

    fetch(`${API}/api/category-products/product/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`);
        }

        return res.json();
      })
      .then((data) => {
        console.log("CATEGORY PRODUCT DETAILS:", data);
        setProduct(data);
      })
      .catch((err) => {
        console.error(
          "Error fetching category product:",
          err
        );
      });
  }, [id]);

  if (!product) {
    return <h2 className="loading">Loading...</h2>;
  }

  /*
    Build images array
  */

  const images = [];

  if (product.main_image) {
    images.push(`${API}${product.main_image}`);
  }

  if (product.gallery) {
    try {
      const galleryImages = Array.isArray(product.gallery)
        ? product.gallery
        : JSON.parse(product.gallery);

      if (Array.isArray(galleryImages)) {
        galleryImages.forEach((img) => {
          images.push(`${API}${img}`);
        });
      }
    } catch (error) {
      console.error(
        "Error parsing product gallery:",
        error
      );
    }
  }

  const nextImage = () => {
    if (images.length === 0) return;

    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (images.length === 0) return;

    setCurrent((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="ProDetails">

      {/* =========================
          LEFT SIDE - GALLERY
      ========================= */}

      <div className="gallery">

        <div className="thumbs">

          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              className={current === i ? "active" : ""}
              onClick={() => setCurrent(i)}
              alt={`${product.title} ${i + 1}`}
            />
          ))}

        </div>

        <div className="main-image">

          {images.length > 0 ? (
            <>
              <button
                className="nav-btn left"
                onClick={prevImage}
                type="button"
              >
                ‹
              </button>

              <img
                src={images[current]}
                alt={product.title}
              />

              <button
                className="nav-btn right"
                onClick={nextImage}
                type="button"
              >
                ›
              </button>
            </>
          ) : (
            <p>No image available</p>
          )}

        </div>

      </div>

      {/* =========================
          RIGHT SIDE - INFO
      ========================= */}

      <div className="info">

        <h2>{product.title}</h2>

        <h3 className="price">
          {product.price} AED
        </h3>

        <p className="desc">
          {product.description || "High quality product."}
        </p>

        {/* SHIPPING */}

        <div className="shipping-box">
          <p>
            Estimated delivery: 5–7 business days
          </p>
        </div>

        {/* COLORS */}

        {product.colors &&
          product.colors.length > 0 && (
            <div className="variants-box">

              <h3>Variations</h3>

              <div className="variant-row">

                <span>Colors:</span>

                <div className="variant-options">

                  {product.colors.map((color, i) => (
                    <div
                      key={i}
                      className="variant-item"
                    >
                      {color}
                    </div>
                  ))}

                </div>

              </div>

            </div>
          )}

        {/* ACTIONS */}

        <div className="actions">

          <button
            className="cart-btn"
            type="button"
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.title,
                price: product.price,
                image: images[0] || "",
              })
            }
          >
            Add to cart
          </button>

          <a
            href="https://wa.me/971545234489"
            target="_blank"
            rel="noopener noreferrer"
            className="chat-btn"
          >
            Chat on WhatsApp
          </a>

        </div>

      </div>

    </div>
  );
};

export default ProDetails;