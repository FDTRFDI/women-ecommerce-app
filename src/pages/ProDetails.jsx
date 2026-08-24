import React, { useState, useContext, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./ProDetails.css";

const API = "https://backend-women-ecommerce.onrender.com";

const ProDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // GET PRODUCT
  // =========================================================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API}/api/category-products/product/${id}`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        if (!data || !data.id) {
          throw new Error("Invalid product data");
        }

        setProduct(data);
        setCurrent(0);
      } catch (err) {
        console.error("Product details error:", err);
        setError("Unable to load this product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // =========================================================
  // IMAGE URL
  // =========================================================
  const getImageUrl = (image) => {
    if (!image) return "";

    if (typeof image !== "string") return "";

    // Already full URL
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    // Backend already returns /uploads/...
    if (image.startsWith("/")) {
      return `${API}${image}`;
    }

    return `${API}/${image}`;
  };

  // =========================================================
  // NORMALIZE COLORS
  // =========================================================
  const normalizedColors = useMemo(() => {
    if (!product?.colors) {
      return [];
    }

    let colors = product.colors;

    // ---------------------------------------------------------
    // CASE 1
    // PostgreSQL / API returns an Array
    // ---------------------------------------------------------
    if (Array.isArray(colors)) {
      return colors
        .flatMap((color) => {
          if (typeof color !== "string") return [];

          const value = color.trim();

          if (!value) return [];

          // Sometimes one item contains JSON array
          if (value.startsWith("[") && value.endsWith("]")) {
            try {
              const parsed = JSON.parse(value);

              if (Array.isArray(parsed)) {
                return parsed;
              }
            } catch (err) {
              // Ignore JSON parsing error
            }
          }

          return [value];
        })
        .map((color) => String(color).trim())
        .filter(Boolean);
    }

    // ---------------------------------------------------------
    // CASE 2
    // API returns JSON string
    // Example:
    // '["transparent 36 , transparent 72","net weight 36 + 72"]'
    // ---------------------------------------------------------
    if (typeof colors === "string") {
      const value = colors.trim();

      if (!value) {
        return [];
      }

      // Try JSON
      if (value.startsWith("[") && value.endsWith("]")) {
        try {
          const parsed = JSON.parse(value);

          if (Array.isArray(parsed)) {
            return parsed
              .flatMap((item) => {
                if (typeof item !== "string") return [];

                const itemValue = item.trim();

                if (!itemValue) return [];

                return [itemValue];
              })
              .filter(Boolean);
          }
        } catch (err) {
          console.log("Colors JSON parse failed");
        }
      }

      // PostgreSQL array format:
      // {"red","blue","green"}
      if (value.startsWith("{") && value.endsWith("}")) {
        const clean = value.substring(1, value.length - 1);

        return clean
          .split(",")
          .map((item) => item.trim().replace(/^"|"$/g, ""))
          .filter(Boolean);
      }

      // Single color
      return [value];
    }

    return [];
  }, [product]);

  // =========================================================
  // IMAGES
  // =========================================================
  const images = useMemo(() => {
    if (!product) {
      return [];
    }

    const result = [];

    // Main image
    if (product.main_image) {
      const mainImage = getImageUrl(product.main_image);

      if (mainImage) {
        result.push(mainImage);
      }
    }

    // Gallery
    if (product.gallery) {
      let gallery = product.gallery;

      // If gallery is string, try JSON
      if (typeof gallery === "string") {
        try {
          gallery = JSON.parse(gallery);
        } catch (err) {
          // PostgreSQL array format
          if (gallery.startsWith("{") && gallery.endsWith("}")) {
            const clean = gallery.substring(1, gallery.length - 1);

            gallery = clean
              .split(",")
              .map((item) => item.trim().replace(/^"|"$/g, ""))
              .filter(Boolean);
          } else {
            gallery = [gallery];
          }
        }
      }

      if (Array.isArray(gallery)) {
        gallery.forEach((image) => {
          const imageUrl = getImageUrl(image);

          if (imageUrl && !result.includes(imageUrl)) {
            result.push(imageUrl);
          }
        });
      }
    }

    return result;
  }, [product]);

  // =========================================================
  // IMAGE NAVIGATION
  // =========================================================
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

  // =========================================================
  // ADD TO CART
  // =========================================================
  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      product_id: product.id,
      id: product.id,
      title: product.title,
      name: product.title,
      price: Number(product.price),
      image: images[0] || "",
    });
  };

  // =========================================================
  // LOADING
  // =========================================================
  if (loading) {
    return (
      <div className="product-details-state">
        <h2>Loading...</h2>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================
  if (error || !product) {
    return (
      <div className="product-details-state">
        <h2>{error || "Unable to load this product."}</h2>

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================
  return (
    <div className="ProDetails">

      {/* =====================================================
          GALLERY
      ===================================================== */}
      <div className="gallery">

        {/* THUMBNAILS */}
        <div className="thumbs">

          {images.map((img, index) => (
            <img
              key={`${img}-${index}`}
              src={img}
              className={current === index ? "active" : ""}
              onClick={() => setCurrent(index)}
              alt={`${product.title} ${index + 1}`}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ))}

        </div>

        {/* MAIN IMAGE */}
        <div className="main-image">

          {images.length > 0 ? (
            <>
              {images.length > 1 && (
                <button
                  className="nav-btn left"
                  onClick={prevImage}
                  type="button"
                >
                  ‹
                </button>
              )}

              <img
                src={images[current]}
                alt={product.title}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              {images.length > 1 && (
                <button
                  className="nav-btn right"
                  onClick={nextImage}
                  type="button"
                >
                  ›
                </button>
              )}
            </>
          ) : (
            <div className="no-image">
              No Image Available
            </div>
          )}

        </div>
      </div>

      {/* =====================================================
          PRODUCT INFO
      ===================================================== */}
      <div className="info">

        {/* TITLE */}
        <h2>{product.title}</h2>

        {/* PRICE */}
        <h3 className="price">
          {Number(product.price || 0).toFixed(2)} AED
        </h3>

        {/* DESCRIPTION */}
        <p className="desc">
          {product.description || "High quality product."}
        </p>

        {/* SHIPPING */}
        <div className="shipping-box">
          <p>
            Estimated delivery: 5–7 business days
          </p>
        </div>

        {/* =================================================
            VARIATIONS
        ================================================= */}
        {normalizedColors.length > 0 && (
          <div className="variants-box">

            <h3>Variations</h3>

            <div className="variant-row">

              <span>Colors:</span>

              <div className="variant-options">

                {normalizedColors.map((color, index) => (
                  <div
                    key={`${color}-${index}`}
                    className="variant-item"
                  >
                    {color}
                  </div>
                ))}

              </div>

            </div>

          </div>
        )}

        {/* =================================================
            ACTIONS
        ================================================= */}
        <div className="actions">

          <button
            className="cart-btn"
            onClick={handleAddToCart}
            type="button"
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