import React, { useContext } from "react";
import { CartContext } from "../../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./ProductSections.css";

const API = "https://backend-women-ecommerce-2.onrender.com";

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
            const productId =
              product.id ||
              product.product_id ||
              product._id;

            const rating = product.rating || 4.5;
            const discount = product.discount || 15;

            const imagePath =
              product.gallery_image ||
              product.image ||
              "";

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
                    alt={product.name}
                    loading="lazy"
                  />
                </div>

                <div className="name">{product.name}</div>

                <div className="rating">⭐ {rating}</div>

                <div className="price">{product.price} AED</div>

                <button
                  className="add-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart({
                      id: productId,
                      name: product.name,
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
