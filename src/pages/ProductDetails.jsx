import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./ProductDetails.css";

const API = "https://backend-women-ecommerce.onrender.com";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setProduct(null);
    setCurrent(0);

    fetch(`${API}/api/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`);
        }

        return res.json();
      })
      .then((data) => {
        console.log("PRODUCT DETAILS:", data);
        setProduct(data);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
      });
  }, [id]);

  if (!product) {
    return <h2 className="loading">Loading...</h2>;
  }

  /*
    Main image + gallery images
  */
  const images = [
    ...(product.image ? [`${API}${product.image}`] : []),
    ...(Array.isArray(product.images)
      ? product.images.map((img) => `${API}${img}`)
      : []),
  ];

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
    <div className="product-details">

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
              alt={`${product.name} ${i + 1}`}
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
                alt={product.name}
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
          RIGHT SIDE - PRODUCT INFO
      ========================= */}

      <div className="info">

        <h2>{product.name}</h2>

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

        {/* VARIATIONS */}

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
                name: product.name,
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

export default ProductDetails;