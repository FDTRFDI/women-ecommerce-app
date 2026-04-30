import React, { useContext } from "react";
import { CartContext } from "../../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./ProductSections.css";

const API = "https://backend-women-ecommerce.onrender.com";
const ProductSection = ({ title, products = [] }) => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div className="noon-section">
      <div className="noon-header">
        <h2>{title}</h2>
      </div>

      <div className="noon-products">
        {products.length === 0 ? (
          <p className="no-products">No products available</p>
        ) : (
          products.map((product) => {
            const productId = product.id;

            const rating = product.rating || 4.5;
            const discount = product.discount || 15;

            // main_image OR first gallery image
            const imagePath =
              product.main_image ||
              (product.gallery?.length > 0 ? product.gallery[0] : "");

            const imageUrl = imagePath.startsWith("http")
              ? imagePath
              : `${API}${imagePath}`;

            return (
              <div
                className="noon-card"
                key={productId}
                onClick={() => navigate(`/product/${productId}`)}
              >
                <span className="discount-badge">-{discount}%</span>

                <div className="image-wrapper">
                  <img
                    src={imageUrl}
                    alt={product.title}
                    loading="lazy"
                  />
                </div>

                <div className="name">{product.title}</div>

                <div className="rating">⭐ {rating}</div>

                <div className="price">{product.price} AED</div>

                <button
                  className="add-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart({
                      id: productId,
                      name: product.title,
                      price: product.price,
                      image: imageUrl,
                    });
                  }}
                >
                  +
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProductSection;
