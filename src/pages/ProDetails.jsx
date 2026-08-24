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

import "./ProDetails.css";

const API =
  "https://backend-women-ecommerce.onrender.com";

const ProDetails = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const { addToCart } =
    useContext(CartContext);

  const [product, setProduct] =
    useState(null);

  const [images, setImages] =
    useState([]);

  const [current, setCurrent] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // LOAD SINGLE CATEGORY PRODUCT
  // ==========================================

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        setLoading(true);
        setError("");

        console.log(
          "Loading category product ID:",
          id
        );

        const response = await fetch(
          `${API}/api/category-products/product/${id}`
        );

        console.log(
          "Product response status:",
          response.status
        );

        if (!response.ok) {

          throw new Error(
            `Product not found (${response.status})`
          );

        }

        const data = await response.json();

        console.log(
          "Product data:",
          data
        );

        if (!data || !data.id) {

          throw new Error(
            "Invalid product data"
          );

        }

        setProduct(data);

        // ======================================
        // BUILD IMAGES
        // ======================================

        const productImages = [];

        // MAIN IMAGE
        if (data.main_image) {

          productImages.push(
            normalizeImage(data.main_image)
          );

        }

        // GALLERY
        if (data.gallery) {

          let gallery = [];

          try {

            gallery = Array.isArray(data.gallery)
              ? data.gallery
              : JSON.parse(data.gallery);

          } catch (error) {

            console.error(
              "Gallery parsing error:",
              error
            );

            gallery = [];

          }

          if (Array.isArray(gallery)) {

            gallery.forEach((image) => {

              if (!image) return;

              const imageUrl =
                normalizeImage(image);

              /*
               * Prevent duplicate main image
               */

              if (
                !productImages.includes(
                  imageUrl
                )
              ) {

                productImages.push(
                  imageUrl
                );

              }

            });

          }

        }

        setImages(productImages);

        setCurrent(0);

      } catch (error) {

        console.error(
          "Product details error:",
          error
        );

        setProduct(null);

        setImages([]);

        setError(
          "Unable to load this product."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchProduct();

  }, [id]);

  // ==========================================
  // NORMALIZE IMAGE URL
  // ==========================================

  const normalizeImage = (image) => {

    if (!image) {
      return "";
    }

    if (image.startsWith("http")) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${API}${image}`;
    }

    return `${API}/${image}`;

  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="product-loading">

        <h2>
          Loading product...
        </h2>

      </div>
    );

  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !product) {

    return (
      <div className="product-error">

        <h2>
          Unable to load this product.
        </h2>

        <p>
          Product ID: {id}
        </p>

        <button
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>

      </div>
    );

  }

  // ==========================================
  // IMAGE NAVIGATION
  // ==========================================

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

  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart = () => {

    addToCart({

      id: product.id,

      product_id: product.id,

      name: product.title,

      title: product.title,

      price: Number(product.price),

      image:
        images.length > 0
          ? images[0]
          : "",

    });

  };

  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="ProDetails">

      {/* =====================================
          LEFT SIDE
      ====================================== */}

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
                  product.title ||
                  "Product"
                }
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
                >
                  ‹
                </button>

              )}

              <img
                src={images[current]}
                alt={
                  product.title ||
                  "Product"
                }
              />

              {images.length > 1 && (

                <button
                  className="nav-btn right"
                  onClick={nextImage}
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

      {/* =====================================
          RIGHT SIDE
      ====================================== */}

      <div className="info">

        {/* PRODUCT TITLE */}

        <h2>
          {product.title}
        </h2>

        {/* PRICE */}

        <h3 className="price">

          {product.price} AED

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
            5–7 business days
          </p>

        </div>

        {/* =================================
            VARIATIONS
        ================================= */}

        {Array.isArray(product.colors) &&
          product.colors.length > 0 && (

            <div className="variants-box">

              <h3>
                Variations
              </h3>

              <div className="variant-row">

                <span>
                  Colors:
                </span>

                <div className="variant-options">

                  {product.colors.map(
                    (color, index) => (

                      <div
                        key={index}
                        className="variant-item"
                      >
                        {color}
                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          )}

        {/* =================================
            ACTIONS
        ================================= */}

        <div className="actions">

          <button
            className="cart-btn"
            onClick={handleAddToCart}
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