import React, {
  useState,
  useEffect,
  useContext,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import API from "../src/config/api";

import "./ProDetails.css";

import { CartContext } from "../context/CartContext";


const ProDetails = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);

  const [current, setCurrent] = useState(0);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ======================================
  // IMAGE URL
  // ======================================

  const getImageUrl = (path) => {

    if (!path) {
      return "";
    }

    if (path.startsWith("http")) {
      return path;
    }

    if (path.startsWith("/")) {
      return `${API}${path}`;
    }

    return `${API}/${path}`;
  };


  // ======================================
  // GET CATEGORY PRODUCT
  // ======================================

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        setLoading(true);

        setError("");

        const response = await fetch(
          `${API}/api/category-products/product/${id}`
        );

        if (!response.ok) {

          throw new Error(
            `Product request failed: ${response.status}`
          );

        }

        const data = await response.json();

        console.log(
          "CATEGORY PRODUCT DETAILS:",
          data
        );

        setProduct(data);

        setCurrent(0);

      } catch (error) {

        console.error(
          "Category product details error:",
          error
        );

        setError(
          "Unable to load this product."
        );

        setProduct(null);

      } finally {

        setLoading(false);

      }

    };

    if (id) {
      fetchProduct();
    }

  }, [id]);


  // ======================================
  // LOADING
  // ======================================

  if (loading) {

    return (
      <h2 className="loading">
        Loading...
      </h2>
    );

  }


  // ======================================
  // ERROR
  // ======================================

  if (error || !product) {

    return (
      <div className="loading">

        <h2>
          {error || "Product not found"}
        </h2>

        <button
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>

      </div>
    );

  }


  // ======================================
  // IMAGES
  // ======================================

  const images = [];


  if (product.main_image) {

    images.push(
      getImageUrl(product.main_image)
    );

  }


  if (product.gallery) {

    try {

      const galleryImages =
        Array.isArray(product.gallery)
          ? product.gallery
          : JSON.parse(product.gallery);


      if (Array.isArray(galleryImages)) {

        galleryImages.forEach((image) => {

          const imageUrl =
            getImageUrl(image);

          if (
            imageUrl &&
            !images.includes(imageUrl)
          ) {

            images.push(imageUrl);

          }

        });

      }

    } catch (error) {

      console.error(
        "Gallery parsing error:",
        error
      );

    }

  }


  // ======================================
  // IMAGE NAVIGATION
  // ======================================

  const nextImage = () => {

    if (images.length === 0) {
      return;
    }

    setCurrent(
      (prev) =>
        (prev + 1) % images.length
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


  // ======================================
  // ADD TO CART
  // ======================================

  const handleAddToCart = () => {

    addToCart({

      id: product.id,

      product_id: product.id,

      name: product.title,

      title: product.title,

      price: Number(product.price),

      image: images[0] || "",

    });

  };


  return (

    <div className="ProDetails">


      {/* ==================================
          GALLERY
      ================================== */}

      <div className="gallery">


        {/* THUMBNAILS */}

        <div className="thumbs">

          {images.map((image, index) => (

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


      {/* ==================================
          PRODUCT INFO
      ================================== */}

      <div className="info">


        <h2>
          {product.title}
        </h2>


        <h3 className="price">
          {product.price} AED
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


        {/* COLORS */}

        {product.colors &&
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


        {/* ACTIONS */}

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