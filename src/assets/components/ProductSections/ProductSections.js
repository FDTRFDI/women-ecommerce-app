import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductSection.css";

const API = "https://backend-women-ecommerce.onrender.com";

const ProductSection = ({ title, products = [] }) => {
  const navigate = useNavigate();

  // =========================================================
  // GET PRODUCT IMAGE
  // =========================================================
  const getImage = (product) => {
    let image = "";

    if (product.main_image) {
      image = product.main_image;
    } else if (product.image) {
      image = product.image;
    } else if (
      Array.isArray(product.gallery) &&
      product.gallery.length > 0
    ) {
      image = product.gallery[0];
    }

    if (!image) {
      return "";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${API}${image}`;
    }

    return `${API}/${image}`;
  };

  // =========================================================
  // OPEN CATEGORY PRODUCT DETAILS
  // =========================================================
  const openProduct = (product) => {
    /*
      مهم جداً:

      ProductSection يجلب المنتجات من:

      /api/category-products

      لذلك هذه المنتجات موجودة في:

      category_products

      وبالتالي يجب فتحها في:

      /prodetails/:id

      وليس:

      /product/:id
    */

    const productId = Number(product?.id);

    if (!productId) {
      console.error(
        "Invalid category product ID:",
        product
      );
      return;
    }

    console.log(
      "Opening category product:",
      productId
    );

    navigate(`/prodetails/${productId}`);
  };

  // =========================================================
  // EMPTY PRODUCTS
  // =========================================================
  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  // =========================================================
  // PAGE
  // =========================================================
  return (
    <section className="product-section">

      {/* =========================
          TITLE
      ========================== */}
      {title && (
        <div className="product-section-header">
          <h2>{title}</h2>
        </div>
      )}

      {/* =========================
          PRODUCTS
      ========================== */}
      <div className="products-grid">

        {products.map((product) => {

          const productId = Number(product.id);
          const imageUrl = getImage(product);

          return (
            <div
              key={productId}
              className="product-card"
              onClick={() => openProduct(product)}
            >

              {/* =========================
                  IMAGE
              ========================== */}
              <div className="product-image-wrapper">

                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.title || "Product"}
                    className="product-image"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />
                ) : (
                  <div className="no-image">
                    No Image
                  </div>
                )}

              </div>

              {/* =========================
                  PRODUCT INFO
              ========================== */}
              <div className="product-info">

                <h3 className="product-title">
                  {product.title || "Product"}
                </h3>

                {/* RATING */}
                <div className="rating-stars">
                  ★★★★☆
                </div>

                {/* PRICE */}
                <div className="price-row">

                  <span className="product-price">
                    {Number(product.price || 0).toFixed(2)} AED
                  </span>

                  {product.discount && (
                    <span className="discount-tag">
                      -{product.discount}%
                    </span>
                  )}

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
};

export default ProductSection;