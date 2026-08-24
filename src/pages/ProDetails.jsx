import React, { useState, useContext, useEffect } from "react";
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

  // ==========================================
  // GET SINGLE CATEGORY PRODUCT
  // ==========================================
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setProduct(null);

        console.log("Loading category product:", id);

        const response = await fetch(
          `${API}/api/category-products/product/${id}`
        );

        console.log("Product response status:", response.status);

        if (!response.ok) {
          throw new Error(`Product request failed: ${response.status}`);
        }

        const data = await response.json();

        console.log("Product data:", data);

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

    if (id) {
      loadProduct();
    }
  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return <h2 className="loading">Loading...</h2>;
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (error || !product) {
    return (
      <div className="product-error">
        <h2>Unable to load this product.</h2>

        <button onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  // ==========================================
  // BUILD IMAGE URL
  // ==========================================
  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${API}${image}`;
    }

    return `${API}/${image}`;
  };

  // ==========================================
  // PRODUCT IMAGES
  // ==========================================
  const images = [];

  if (product.main_image) {
    images.push(getImageUrl(product.main_image));
  }

  if (product.gallery) {
    let galleryImages = [];

    try {
      if (Array.isArray(product.gallery)) {
        galleryImages = product.gallery;
      } else if (typeof product.gallery === "string") {
        galleryImages = JSON.parse(product.gallery);
      }
    } catch (err) {
      console.error("Gallery parse error:", err);
      galleryImages = [];
    }

    if (Array.isArray(galleryImages)) {
      galleryImages.forEach((img) => {
        if (img) {
          images.push(getImageUrl(img));
        }
      });
    }
  }

  // ==========================================
  // REMOVE DUPLICATE IMAGES
  // ==========================================
  const uniqueImages = [...new Set(images)];

  // ==========================================
  // COLORS / VARIATIONS
  // ==========================================
  const getColors = () => {
    if (!product.colors) return [];

    let colors = product.colors;

    try {
      // PostgreSQL ممكن يرجع Array
      if (Array.isArray(colors)) {
        // عندك في قاعدة البيانات القيمة نفسها JSON string
        if (
          colors.length === 1 &&
          typeof colors[0] === "string" &&
          colors[0].trim().startsWith("[")
        ) {
          colors = JSON.parse(colors[0]);
        }
      }

      // لو رجعت String مباشرة
      if (typeof colors === "string") {
        colors = JSON.parse(colors);
      }
    } catch (err) {
      console.error("Colors parse error:", err);
      return [];
    }

    if (!Array.isArray(colors)) {
      return [];
    }

    return colors
      .flatMap((color) => {
        if (typeof color !== "string") return [];

        // لو القيمة فيها JSON داخلها
        if (color.trim().startsWith("[")) {
          try {
            const parsed = JSON.parse(color);

            if (Array.isArray(parsed)) {
              return parsed;
            }
          } catch {
            return [color];
          }
        }

        return [color];
      })
      .map((color) => color.trim())
      .filter(Boolean);
  };

  const colors = getColors();

  // ==========================================
  // IMAGE NAVIGATION
  // ==========================================
  const nextImage = () => {
    if (uniqueImages.length === 0) return;

    setCurrent(
      (prev) => (prev + 1) % uniqueImages.length
    );
  };

  const prevImage = () => {
    if (uniqueImages.length === 0) return;

    setCurrent(
      (prev) =>
        prev === 0
          ? uniqueImages.length - 1
          : prev - 1
    );
  };

  // ==========================================
  // ADD TO CART
  // ==========================================
  const handleAddToCart = () => {
    addToCart({
      product_id: product.id,
      id: product.id,
      title: product.title,
      name: product.title,
      price: Number(product.price),
      image: uniqueImages[0] || "",
    });
  };

  // ==========================================
  // PAGE
  // ==========================================
  return (
    <div className="ProDetails">

      {/* ================================
          GALLERY
      ================================= */}

      <div className="gallery">

        <div className="thumbs">

          {uniqueImages.map((img, i) => (
            <img
              key={`${img}-${i}`}
              src={img}
              className={current === i ? "active" : ""}
              onClick={() => setCurrent(i)}
              alt={`${product.title} ${i + 1}`}
            />
          ))}

        </div>

        <div className="main-image">

          {uniqueImages.length > 0 ? (
            <>
              {uniqueImages.length > 1 && (
                <button
                  className="nav-btn left"
                  onClick={prevImage}
                  type="button"
                >
                  ‹
                </button>
              )}

              <img
                src={uniqueImages[current]}
                alt={product.title}
              />

              {uniqueImages.length > 1 && (
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
              No Image
            </div>
          )}

        </div>

      </div>

      {/* ================================
          PRODUCT INFORMATION
      ================================= */}

      <div className="info">

        <h2>
          {product.title}
        </h2>

        <h3 className="price">
          {Number(product.price).toFixed(2)} AED
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

        <div className="variants-box">

          <h3>
            Variations
          </h3>

          {colors.length > 0 ? (
            <div className="variant-row">

              <span>
                Colors:
              </span>

              <div className="variant-options">

                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="variant-item"
                  >
                    {color}
                  </div>
                ))}

              </div>

            </div>
          ) : (
            <p>
              No variations available.
            </p>
          )}

        </div>

        {/* ACTIONS */}

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