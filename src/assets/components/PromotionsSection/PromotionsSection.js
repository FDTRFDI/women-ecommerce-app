import React, { useContext } from "react";
import { CartContext } from "../../../context/CartContext";
import { useNavigate } from "react-router-dom";
import img from "../img/product-1/1.png";

const ProductSection = ({ title, products = [] }) => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div className="noon-section">
      
      <div className="noon-header">
        <h2>{title}</h2>

        {/* ✅ عرض الصورة بشكل صحيح */}
        <img
          src={img}
          alt="section"
          className="section-image"
        />
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

            // ✅ دعم multiple images
            const productImage =
              product.images?.[0] || product.image || img;

            return (
              <div
                className="noon-card"
                key={productId}
                onClick={() => navigate(`/product/${productId}`)}
              >
                <div className="image-wrapper">
                  <img
                    src={productImage}
                    alt={product.name}
                    loading="lazy"
                  />
                </div>

                <div className="name">{product.name}</div>
                <div className="price">{product.price} UAE</div>

                <button
                  className="add-btn"
                  onClick={(e) => {
                    e.stopPropagation();

                    addToCart({
                      id: productId,
                      name: product.name,
                      price: product.price,
                      image: productImage,
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