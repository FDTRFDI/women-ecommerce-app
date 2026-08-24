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
  // LOAD SINGLE CATEGORY PRODUCT
  // =========================================================
  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setProduct(null);
        setCurrent(0);

        // ---------------------------------------------
        // Validate ID
        // ---------------------------------------------
        const productId = Number(id);

        if (!Number.isInteger(productId) || productId <= 0) {
          throw new Error("Invalid product ID");
        }

        // ---------------------------------------------
        // IMPORTANT:
        // category_products.id
        // ---------------------------------------------
        const url =
          `${API}/api/category-products/product/${productId}`;

        console.log("=================================");
        console.log("Loading category product");
        console.log("Product ID:", productId);
        console.log("Request URL:", url);
        console.log("=================================");

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });

        console.log(
          "Product response status:",
          response.status
        );

        // ---------------------------------------------
        // Read response safely
        // ---------------------------------------------
        const text = await response.text();

        console.log("Raw product response:", text);

        if (!response.ok) {
          throw new Error(
            `Product request failed: ${response.status}`
          );
        }

        let data;

        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error(
            "Product JSON parse error:",
            parseError
          );

          throw new Error(
            "Server returned invalid product data"
          );
        }

        console.log("Parsed product:", data);

        if (!data) {
          throw new Error("Empty product response");
        }

        // ---------------------------------------------
        // Support different backend response formats
        // ---------------------------------------------
        let productData = data;

        if (
          data.data &&
          !Array.isArray(data.data) &&
          typeof data.data === "object"
        ) {
          productData = data.data;
        }

        if (
          data.product &&
          typeof data.product === "object"
        ) {
          productData = data.product;
        }

        // ---------------------------------------------
        // Validate returned product
        // ---------------------------------------------
        if (
          !productData.id ||
          Number(productData.id) !== productId
        ) {
          console.error(
            "Returned product does not match requested ID",
            {
              requestedId: productId,
              returnedProduct: productData,
            }
          );

          throw new Error(
            "Returned product does not match requested product"
          );
        }

        if (!cancelled) {
          setProduct(productData);
          setCurrent(0);
        }

      } catch (err) {
        console.error(
          "================================="
        );
        console.error(
          "Product details error:",
          err
        );
        console.error(
          "================================="
        );

        if (!cancelled) {
          setError(
            err.message ||
            "Unable to load this product."
          );
        }

      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadProduct();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  // =========================================================
  // IMAGE URL
  // =========================================================
  const getImageUrl = (image) => {
    if (!image) return "";

    if (typeof image !== "string") {
      return "";
    }

    const cleanImage = image.trim();

    if (!cleanImage) {
      return "";
    }

    // Full URL
    if (
      cleanImage.startsWith("http://") ||
      cleanImage.startsWith("https://")
    ) {
      return cleanImage;
    }

    // Backend already returns /uploads/filename
    if (cleanImage.startsWith("/")) {
      return `${API}${cleanImage}`;
    }

    // filename only
    return `${API}/${cleanImage}`;
  };

  // =========================================================
  // PRODUCT IMAGES
  // =========================================================
  const images = useMemo(() => {
    if (!product) {
      return [];
    }

    const result = [];

    // Main image
    if (product.main_image) {
      result.push(
        getImageUrl(product.main_image)
      );
    }

    // Gallery
    if (product.gallery) {
      let gallery = [];

      try {
        if (Array.isArray(product.gallery)) {
          gallery = product.gallery;
        } else if (
          typeof product.gallery === "string"
        ) {
          const parsed = JSON.parse(
            product.gallery
          );

          if (Array.isArray(parsed)) {
            gallery = parsed;
          }
        }
      } catch (error) {
        console.error(
          "Gallery parse error:",
          error
        );
      }

      gallery.forEach((image) => {
        const url = getImageUrl(image);

        if (url) {
          result.push(url);
        }
      });
    }

    // Remove empty + duplicate images
    return [...new Set(result)].filter(Boolean);

  }, [product]);

  // =========================================================
  // COLORS / VARIATIONS
  // =========================================================
  const colors = useMemo(() => {
    if (!product || !product.colors) {
      return [];
    }

    let value = product.colors;

    try {
      // ---------------------------------------------
      // PostgreSQL ARRAY
      // ---------------------------------------------
      if (Array.isArray(value)) {

        // Example:
        // [
        //   '["transparent 36 , transparent 72 ","net weight 36 + 72 "]'
        // ]
        if (
          value.length === 1 &&
          typeof value[0] === "string" &&
          value[0].trim().startsWith("[")
        ) {
          value = JSON.parse(value[0]);
        }
      }

      // ---------------------------------------------
      // JSON string
      // ---------------------------------------------
      if (typeof value === "string") {
        value = JSON.parse(value);
      }

    } catch (error) {
      console.error(
        "Colors parse error:",
        error
      );

      // If parsing fails, try using original value
      if (typeof product.colors === "string") {
        value = [product.colors];
      } else {
        value = product.colors;
      }
    }

    if (!Array.isArray(value)) {
      return [];
    }

    const result = [];

    value.forEach((item) => {
      if (!item) {
        return;
      }

      // Nested JSON array
      if (
        typeof item === "string" &&
        item.trim().startsWith("[")
      ) {
        try {
          const nested = JSON.parse(item);

          if (Array.isArray(nested)) {
            nested.forEach((nestedItem) => {
              if (
                nestedItem !== null &&
                nestedItem !== undefined
              ) {
                const text =
                  String(nestedItem).trim();

                if (text) {
                  result.push(text);
                }
              }
            });

            return;
          }
        } catch {
          // continue normally
        }
      }

      const text = String(item).trim();

      if (text) {
        result.push(text);
      }
    });

    return [...new Set(result)];

  }, [product]);

  // =========================================================
  // NEXT IMAGE
  // =========================================================
  const nextImage = () => {
    if (images.length <= 1) {
      return;
    }

    setCurrent(
      (prev) =>
        (prev + 1) % images.length
    );
  };

  // =========================================================
  // PREVIOUS IMAGE
  // =========================================================
  const prevImage = () => {
    if (images.length <= 1) {
      return;
    }

    setCurrent(
      (prev) =>
        prev === 0
          ? images.length - 1
          : prev - 1
    );
  };

  // =========================================================
  // ADD TO CART
  // =========================================================
  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    const productId = Number(product.id);

    addToCart({
      product_id: productId,
      id: productId,

      title: product.title,
      name: product.title,

      price: Number(product.price || 0),

      image: images[0] || "",

      // Keep category information too
      category_id: product.category_id,
    });
  };

  // =========================================================
  // LOADING
  // =========================================================
  if (loading) {
    return (
      <div className="product-error">
        <h2>Loading product...</h2>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================
  if (error || !product) {
    return (
      <div className="product-error">

        <h2>
          Unable to load this product.
        </h2>

        <p
          style={{
            color: "#777",
            marginTop: "10px",
          }}
        >
          Product ID: {id}
        </p>

        {error && (
          <p
            style={{
              color: "red",
              marginTop: "8px",
            }}
          >
            {error}
          </p>
        )}

        <button
          onClick={() => navigate(-1)}
          type="button"
        >
          Go Back
        </button>

      </div>
    );
  }

  // =========================================================
  // SAFE CURRENT IMAGE INDEX
  // =========================================================
  const safeCurrent =
    images.length > 0
      ? Math.min(
          current,
          images.length - 1
        )
      : 0;

  // =========================================================
  // PAGE
  // =========================================================
  return (
    <div className="ProDetails">

      {/* =================================================
          GALLERY
      ================================================= */}

      <div className="gallery">

        {/* THUMBNAILS */}

        <div className="thumbs">

          {images.map((img, index) => (
            <img
              key={`${img}-${index}`}
              src={img}
              className={
                safeCurrent === index
                  ? "active"
                  : ""
              }
              onClick={() =>
                setCurrent(index)
              }
              alt={`${product.title} ${index + 1}`}
              onError={(event) => {
                event.currentTarget.style.opacity =
                  "0.4";
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
                  aria-label="Previous image"
                >
                  ‹
                </button>
              )}

              <img
                src={images[safeCurrent]}
                alt={product.title}
                onError={(event) => {
                  console.error(
                    "Image failed:",
                    images[safeCurrent]
                  );

                  event.currentTarget.style.display =
                    "none";
                }}
              />

              {images.length > 1 && (
                <button
                  className="nav-btn right"
                  onClick={nextImage}
                  type="button"
                  aria-label="Next image"
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

      {/* =================================================
          PRODUCT INFORMATION
      ================================================= */}

      <div className="info">

        {/* TITLE */}

        <h2>
          {product.title}
        </h2>

        {/* PRICE */}

        <h3 className="price">
          {Number(
            product.price || 0
          ).toFixed(2)} AED
        </h3>

        {/* DESCRIPTION */}

        <p className="desc">
          {product.description ||
            "High quality product."}
        </p>

        {/* SHIPPING */}

        <div className="shipping-box">

          <p>
            Estimated delivery:
            {" "}
            5–7 business days
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

                {colors.map(
                  (color, index) => (
                    <div
                      key={`${color}-${index}`}
                      className="variant-item"
                    >
                      {color}
                    </div>
                  )
                )}

              </div>

            </div>

          ) : (

            <p>
              No variations available.
            </p>

          )}

        </div>

        {/* ACTION BUTTONS */}

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