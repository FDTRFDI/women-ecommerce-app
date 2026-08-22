import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../src/config/api";
import "./ProDetails.css";
import { CartContext } from "../context/CartContext";

const ProDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch(`${API}/api/category-products/product/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const productData =
          data.data ? data.data :
          Array.isArray(data) ? data[0] :
          data;

        setProduct(productData);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <h2 className="loading">Loading...</h2>;

  // -----------------------------
  // BUILD IMAGES WITH FULL FALLBACK
  // -----------------------------
  let images = [];

  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    product.images.forEach(img => images.push(`${API}${img}`));
  } 
  else if (product.gallery) {
    const galleryImages = Array.isArray(product.gallery)
      ? product.gallery
      : JSON.parse(product.gallery);

    galleryImages.forEach((img) => {
      images.push(`${API}${img}`);
    });
  } 
  else if (product.main_image) {
    images.push(`${API}${product.main_image}`);
  }

  // FINAL FALLBACK (ALWAYS SHOW IMAGE)
  if (!Array.isArray(images) || images.length === 0) {
    images = ["https://via.placeholder.com/600x800?text=No+Image"];
  }

  const nextImage = () =>
    setCurrent((prev) => (prev + 1) % images.length);

  const prevImage = () =>
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="ProDetails">

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
            <img src={images[current]} alt={product.title} />
            <button className="nav-btn right" onClick={nextImage}>›</button>
          </>
        </div>
      </div>

      {/* RIGHT SIDE — INFO */}
      <div className="info">
        <h2>{product.title}</h2>
        <h3 className="price">{product.price} AED</h3>
        <p className="desc">{product.description}</p>

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
                name: product.title,
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

export default ProDetails;
