import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../context/CartContext";
import "./ProductSections.css";

const API = "https://backend-women-ecommerce.onrender.com";

function ProductSections() {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // GET PRODUCTS
  // =========================================================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        console.log("=================================");
        console.log("GETTING CATEGORY PRODUCTS");
        console.log(`${API}/api/category-products`);
        console.log("=================================");

        const response = await fetch(
          `${API}/api/category-products`
        );

        console.log(
          "Category products status:",
          response.status
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load products: ${response.status}`
          );
        }

        const data = await response.json();

        console.log(
          "CATEGORY PRODUCTS RESPONSE:",
          data
        );

        // =====================================================
        // NORMALIZE API RESPONSE
        // =====================================================

        let list = [];

        if (Array.isArray(data)) {
          list = data;
        } else if (Array.isArray(data.data)) {
          list = data.data;
        } else if (Array.isArray(data.products)) {
          list = data.products;
        } else if (
          Array.isArray(data.category_products)
        ) {
          list = data.category_products;
        }

        console.log(
          "NORMALIZED PRODUCTS:",
          list
        );

        console.log(
          "PRODUCT COUNT:",
          list.length
        );

        setProducts(list);

      } catch (error) {
        console.error(
          "ERROR FETCHING CATEGORY PRODUCTS:",
          error
        );

        setProducts([]);

      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // =========================================================
  // GET PRODUCT IMAGE
  // =========================================================
  const getImage = (product) => {
    let image = "";

    if (product?.main_image) {
      image = product.main_image;
    } else if (product?.image) {
      image = product.image;
    } else if (product?.gallery) {
      try {
        const gallery = Array.isArray(product.gallery)
          ? product.gallery
          : JSON.parse(product.gallery);

        if (
          Array.isArray(gallery) &&
          gallery.length > 0
        ) {
          image = gallery[0];
        }
      } catch (error) {
        console.error(
          "Gallery parse error:",
          error
        );
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

  // =========================================================
  // OPEN PRODUCT
  // =========================================================
  const openProduct = (product) => {
    const productId = Number(product?.id);

    if (!productId) {
      console.error(
        "Invalid product ID:",
        product
      );
      return;
    }

    console.log(
      "Opening product:",
      productId
    );

    navigate(`/prodetails/${productId}`);
  };

  // =========================================================
  // ADD TO CART
  // =========================================================
  const handleAddToCart = (
    event,
    product
  ) => {
    event.stopPropagation();

    const productId = Number(product?.id);

    if (!productId) {
      console.error(
        "Invalid product ID:",
        product
      );
      return;
    }

    const imageUrl = getImage(product);

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
      price: Number(
        product.price || 0
      ),
      image: imageUrl,
    });
  };

  // =========================================================
  // LOADING
  // =========================================================
  if (loading) {
    return (
      <section className="noon-section">

        <div className="noon-header">
          <h2>Best Deals</h2>
        </div>

        <div className="noon-products">
          <p className="no-products">
            Loading products...
          </p>
        </div>

      </section>
    );
  }

  // =========================================================
  // NO PRODUCTS
  // =========================================================
  if (!products.length) {
    return (
      <section className="noon-section">

        <div className="noon-header">
          <h2>Best Deals</h2>
        </div>

        <div className="noon-products">
          <p className="no-products">
            No products available
          </p>
        </div>

      </section>
    );
  }

  // =========================================================
  // PRODUCTS
  // =========================================================
  return (
    <section className="noon-section">

      {/* HEADER */}
      <div className="noon-header">
        <h2>Best Deals</h2>
      </div>

      {/* PRODUCTS */}
      <div className="noon-products">

        {products.map((product, index) => {

          const productId = Number(
            product?.id
          );

          const imageUrl =
            getImage(product);

          return (
            <div
              key={
                productId ||
                `product-${index}`
              }
              className="noon-product-card"
            >

              {/* CLICK AREA */}
              <div
                className="noon-product-click"
                onClick={() =>
                  openProduct(product)
                }
              >

                {/* IMAGE */}
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
                        console.error(
                          "Image failed:",
                          imageUrl
                        );

                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                  ) : (

                    <div className="no-image">
                      No Image
                    </div>

                  )}

                  {/* DISCOUNT */}
                  {product.discount ? (
                    <span className="discount-badge">
                      -{product.discount}%
                    </span>
                  ) : null}

                </div>

                {/* PRODUCT INFO */}
                <div className="noon-product-info">

                  <h3>
                    {product.title ||
                      product.name ||
                      "Product"}
                  </h3>

                  {/* RATING */}
                  <div className="rating">
                    ★ 4.5
                  </div>

                  {/* PRICE */}
                  <div className="product-bottom">

                    <span className="product-price">
                      {Number(
                        product.price || 0
                      ).toFixed(2)} AED
                    </span>

                  </div>

                </div>

              </div>

              {/* ADD TO CART */}
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
        })}

      </div>

    </section>
  );
}

export default ProductSections;