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
    fetch(`${API}/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        const productData =
          data.data ? data.data :
          Array.isArray(data) ? data[0] :
          data;

        setProduct(productData);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <h2 className="loading">Loading...</h2>;

  // -----------------------------
  // BUILD IMAGES WITH FULL FALLBACK
  // -----------------------------
  let images =
    product.images && Array.isArray(product.images) && product.images.length > 0
      ? product.images.map(img => `${API}${img}`)
      : product.gallery
      ? (Array.isArray(product.gallery)
          ? product.gallery.map(img => `${API}${img}`)
          : JSON.parse(product.gallery).map(img => `${API}${img}`))
      : product.main_image
      ? [`${API}${product.main_image}`]
      : product.image
      ? [`${API}${product.image}`]
      : [];

  // FINAL FALLBACK (ALWAYS SHOW IMAGE)
  if (!Array.isArray(images) || images.length === 0) {
    images = ["https://via.placeholder.com/600x800?text=No+Image"];
  }

  const nextImage = () =>
    setCurrent((prev) => (prev + 1) % images.length);

  const prevImage = () =>
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="product-details">

      {/* LEFT SIDE — GALLERY */}
      <div className="gallery">
        <div className="thumbs">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              className={current === i ? "active" : ""}
              onClick={() => setCurrent(i)}
              alt=""
            />
          ))}
        </div>

        <div className="main-image">
          <>
            <button className="nav-btn left" onClick={prevImage}>‹</button>
            <img src={images[current]} alt={product.name} />
            <button className="nav-btn right" onClick={nextImage}>›</button>
          </>
        </div>
      </div>

      {/* RIGHT SIDE — INFO */}
      <div className="info">
        <h2>{product.name}</h2>
        <h3 className="price">{product.price} AED</h3>

        <p className="desc">
          {product.description || "High quality product."}
        </p>

        <div className="shipping-box">
          <p>Estimated delivery: 5–7 business days</p>
        </div>

        {/* COLORS */}
        {product.colors && product.colors.length > 0 && (
          <div className="variants-box">
            <h3>Variations</h3>

            <div className="variant-row">
              <span>Colors:</span>
              <div className="variant-options">
                {product.colors.map((c, i) => (
                  <div key={i} className="variant-item">
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="actions">
          <button
            className="cart-btn"
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: images[0],
              })
            }
          >
            Add to cart
          </button>

          <a
            href="https://wa.me/+971545234489"
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
