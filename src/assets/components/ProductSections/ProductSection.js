import React, { useContext } from "react";
import { CartContext } from "../../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./ProductsSections.css";

const API = "https://backend-women-ecommerce.onrender.com";

const ProductSection = ({ title, products = [] }) => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const getImageUrl = (product) => {
    let image =
      product.main_image ||
      product.image ||
      "";

    if (!image && product.gallery) {
      try {
        const gallery = Array.isArray(product.gallery)
          ? product.gallery
          : JSON.parse(product.gallery);

        if (Array.isArray(gallery) && gallery.length > 0) {
          image = gallery[0];
        }
      } catch (error) {
        console.error("Gallery parse error:", error);
      }
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

  const openProduct = (product) => {
    const productId = Number(product.id);

    if (!productId) {
      console.error("Invalid product ID:", product);
      return;
    }

    /*
      Best Deals يحتوي على category-products
      لذلك نفتح من endpoint الخاص بـ category-products
      وليس /api/products/:id
    */

    navigate(`/prodetails/${productId}`);
  };

  const handleAddToCart = (event, product) => {
    event.stopPropagation();

    const productId = Number(product.id);

    addToCart({
      id: productId,
      product_id: productId,
      name: product.name || product.title,
      title: product.title || product.name,
      price: Number(product.price || 0),
      image: getImageUrl(product),
    });
  };

  return (
    <section className="noon-section">

      <div className="noon-header">
        <h2>{title}</h2>
      </div>

      <div className="noon-products">

        {products.length === 0 ? (

          <p className="no-products">
            No products available
          </p>

        ) : (

          products.map((product) => {

            const productId = Number(product.id);
            const imageUrl = getImageUrl(product);

            return (
              <div
                key={productId}
                className="noon-product-card"
              >

                <div
                  className="noon-product-click"
                  onClick={() => openProduct(product)}
                >

                  <div className="noon-image-wrapper">

                    {imageUrl ? (

                      <img
                        src={imageUrl}
                        alt={
                          product.title ||
                          product.name ||
                          "Product"
                        }
                        className="noon-product-image"
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

                    {product.discount && (
                      <span className="discount-badge">
                        -{product.discount}%
                      </span>
                    )}

                  </div>

                  <div className="noon-product-info">

                    <h3>
                      {product.title ||
                        product.name ||
                        "Product"}
                    </h3>

                    <div className="rating">
                      ★ 4.5
                    </div>

                    <div className="product-bottom">

                      <span className="product-price">
                        {Number(
                          product.price || 0
                        ).toFixed(2)} AED
                      </span>

                    </div>

                  </div>

                </div>

                <button
                  type="button"
                  className="add-product-btn"
                  onClick={(event) =>
                    handleAddToCart(
                      event,
                      product
                    )
                  }
                >
                  +
                </button>

              </div>
            );
          })

        )}

      </div>

    </section>
  );
};

export default ProductSection;