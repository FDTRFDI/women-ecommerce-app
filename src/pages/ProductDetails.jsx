import React, {
  useState,
  useContext,
  useEffect,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import { CartContext } from "../context/CartContext";

import "./ProductDetails.css";

const API =
  "https://backend-women-ecommerce.onrender.com";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } =
    useContext(CartContext);

  const [product, setProduct] =
    useState(null);

  const [current, setCurrent] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================================
  // IMAGE URL
  // =========================================================

  const getImageUrl = (path) => {
    if (!path) {
      return "";
    }

    if (
      typeof path !== "string"
    ) {
      return "";
    }

    if (
      path.startsWith("http://") ||
      path.startsWith("https://")
    ) {
      return path;
    }

    if (path.startsWith("/")) {
      return `${API}${path}`;
    }

    return `${API}/${path}`;
  };

  // =========================================================
  // PARSE ARRAY
  // =========================================================

  const parseArray = (value) => {
    if (!value) {
      return [];
    }

    // Already array
    if (Array.isArray(value)) {
      let result = value;

      // Handle PostgreSQL array containing JSON string
      if (
        result.length === 1 &&
        typeof result[0] === "string" &&
        result[0].trim().startsWith("[")
      ) {
        try {
          result = JSON.parse(result[0]);
        } catch {
          return result;
        }
      }

      return Array.isArray(result)
        ? result
        : [];
    }

    // JSON string
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);

        return Array.isArray(parsed)
          ? parsed
          : [];
      } catch {
        return [];
      }
    }

    return [];
  };

  // =========================================================
  // GET NORMAL PRODUCT
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setProduct(null);
        setCurrent(0);

        const productId = Number(id);

        if (!productId) {
          throw new Error(
            "Invalid product ID"
          );
        }

        console.log(
          "Loading normal product:",
          productId
        );

        /*
          IMPORTANT

          Normal products use /api/products.

          We first try the standard endpoint.
        */

        let response = await fetch(
          `${API}/api/products/${productId}`
        );

        console.log(
          "Normal product response:",
          response.status
        );

        /*
          Some backend versions expose the
          single product through:

          /api/products/product/:id

          If the first endpoint returns 404,
          automatically try that endpoint.
        */

        if (response.status === 404) {
          console.log(
            "Trying alternative product endpoint..."
          );

          response = await fetch(
            `${API}/api/products/product/${productId}`
          );

          console.log(
            "Alternative product response:",
            response.status
          );
        }

        if (!response.ok) {
          throw new Error(
            `Product request failed: ${response.status}`
          );
        }

        const data =
          await response.json();

        console.log(
          "NORMAL PRODUCT DETAILS:",
          data
        );

        /*
          Handle APIs that return:

          {
            data: {...}
          }

          or:

          {
            product: {...}
          }

          as well as direct product object.
        */

        const productData =
          data?.product ||
          data?.data ||
          data;

        if (
          !productData ||
          !productData.id
        ) {
          throw new Error(
            "Invalid product data"
          );
        }

        if (!cancelled) {
          setProduct(productData);
          setCurrent(0);
        }

      } catch (err) {
        console.error(
          "Product details error:",
          err
        );

        if (!cancelled) {
          setError(
            "Unable to load this product."
          );

          setProduct(null);
        }

      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchProduct();
    }

    return () => {
      cancelled = true;
    };

  }, [id]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <h2 className="loading">
        Loading...
      </h2>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !product) {
    return (
      <div className="loading">

        <h2>
          {error ||
            "Product not found"}
        </h2>

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
  // PRODUCT IMAGES
  // =========================================================

  const images = [];

  // Main image
  if (product.image) {
    const image =
      getImageUrl(product.image);

    if (
      image &&
      !images.includes(image)
    ) {
      images.push(image);
    }
  }

  // Main image alternative
  if (product.main_image) {
    const image =
      getImageUrl(
        product.main_image
      );

    if (
      image &&
      !images.includes(image)
    ) {
      images.push(image);
    }
  }

  // images
  const productImages =
    parseArray(product.images);

  productImages.forEach(
    (image) => {
      const imageUrl =
        getImageUrl(image);

      if (
        imageUrl &&
        !images.includes(imageUrl)
      ) {
        images.push(imageUrl);
      }
    }
  );

  // gallery
  const galleryImages =
    parseArray(product.gallery);

  galleryImages.forEach(
    (image) => {
      const imageUrl =
        getImageUrl(image);

      if (
        imageUrl &&
        !images.includes(imageUrl)
      ) {
        images.push(imageUrl);
      }
    }
  );

  // =========================================================
  // COLORS / VARIATIONS
  // =========================================================

  const colors = parseArray(
    product.colors
  )
    .flatMap((color) => {

      if (
        typeof color !== "string"
      ) {
        return [];
      }

      const trimmed =
        color.trim();

      /*
        Handle JSON inside
        PostgreSQL array.
      */

      if (
        trimmed.startsWith("[")
      ) {
        try {
          const parsed =
            JSON.parse(trimmed);

          if (
            Array.isArray(parsed)
          ) {
            return parsed;
          }
        } catch {
          return [trimmed];
        }
      }

      return [trimmed];
    })
    .map((color) =>
      String(color).trim()
    )
    .filter(Boolean);

  // =========================================================
  // IMAGE NAVIGATION
  // =========================================================

  const nextImage = () => {
    if (images.length === 0) {
      return;
    }

    setCurrent(
      (prev) =>
        (prev + 1) %
        images.length
    );
  };

  const prevImage = () => {
    if (images.length === 0) {
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
    const productId =
      Number(product.id);

    if (!productId) {
      console.error(
        "Invalid product ID:",
        product
      );
      return;
    }

    addToCart({
      id: productId,

      product_id: productId,

      name:
        product.name ||
        product.title ||
        "Product",

      title:
        product.title ||
        product.name ||
        "Product",

      price:
        Number(product.price || 0),

      image:
        images[0] || "",
    });
  };

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="product-details">

      {/* =====================================================
          GALLERY
      ====================================================== */}

      <div className="gallery">

        {/* THUMBNAILS */}

        <div className="thumbs">

          {images.map(
            (image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                className={
                  current === index
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setCurrent(index)
                }
                alt={
                  product.name ||
                  product.title ||
                  `Product ${
                    index + 1
                  }`
                }
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
                }}
              />
            )
          )}

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
                src={
                  images[current]
                }
                alt={
                  product.name ||
                  product.title ||
                  "Product"
                }
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
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
              No Image
            </div>
          )}

        </div>

      </div>

      {/* =====================================================
          PRODUCT INFORMATION
      ====================================================== */}

      <div className="info">

        <h2>
          {product.name ||
            product.title}
        </h2>

        <h3 className="price">
          {Number(
            product.price || 0
          ).toFixed(2)}{" "}
          AED
        </h3>

        <p className="desc">
          {product.description ||
            "High quality product."}
        </p>

        {/* SHIPPING */}

        <div className="shipping-box">

          <p>
            Estimated delivery:
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

        {/* ACTIONS */}

        <div className="actions">

          <button
            className="cart-btn"
            onClick={
              handleAddToCart
            }
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

export default ProductDetails;