import React, { useEffect, useState } from "react";
import ProductSection from "./ProductSection";
import "./ProductSections.css";

const API = "https://backend-women-ecommerce.onrender.com";

function ProductSections() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // GET ALL PRODUCTS
  // =========================================================
  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("=================================");
        console.log("GETTING ALL PRODUCTS");
        console.log(`${API}/api/products`);
        console.log("=================================");

        const response = await fetch(
          `${API}/api/products`
        );

        console.log(
          "Products status:",
          response.status
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load products: ${response.status}`
          );
        }

        const data = await response.json();

        console.log(
          "PRODUCTS RESPONSE:",
          data
        );

        // =====================================================
        // NORMALIZE RESPONSE
        // =====================================================

        let list = [];

        if (Array.isArray(data)) {
          list = data;
        } else if (
          data &&
          Array.isArray(data.data)
        ) {
          list = data.data;
        } else if (
          data &&
          Array.isArray(data.products)
        ) {
          list = data.products;
        }

        console.log(
          "NORMALIZED PRODUCTS:",
          list
        );

        // =====================================================
        // CONVERT PRODUCTS TO STORE FORMAT
        // =====================================================

        const validProducts = list
          .filter(
            (product) =>
              product &&
              typeof product === "object" &&
              !Array.isArray(product)
          )
          .map((product) => {

            let image = product.image || "";

            // -----------------------------------------------
            // IMAGE URL
            // -----------------------------------------------

            if (image) {

              if (
                image.startsWith("http://") ||
                image.startsWith("https://")
              ) {
                // Already full URL
              } else if (image.startsWith("/")) {
                image = `${API}${image}`;
              } else {
                image = `${API}/uploads/${image}`;
              }

            }

            // -----------------------------------------------
            // RETURN STORE PRODUCT
            // -----------------------------------------------

            return {
              ...product,

              // ProductManager uses "name"
              // ProductSection uses "title"
              title:
                product.title ||
                product.name ||
                "Product",

              name:
                product.name ||
                product.title ||
                "Product",

              price: Number(
                product.price || 0
              ),

              image,

              main_image: image,

              colors: Array.isArray(
                product.colors
              )
                ? product.colors
                : [],
            };
          });

        console.log(
          "VALID PRODUCTS:",
          validProducts
        );

        console.log(
          "PRODUCT COUNT:",
          validProducts.length
        );

        if (validProducts.length > 0) {

          console.log(
            "FIRST PRODUCT:",
            validProducts[0]
          );

          console.log(
            "FIRST PRODUCT ID:",
            validProducts[0]?.id
          );

          console.log(
            "FIRST PRODUCT NAME:",
            validProducts[0]?.name
          );

          console.log(
            "FIRST PRODUCT IMAGE:",
            validProducts[0]?.image
          );

          console.log(
            "FIRST PRODUCT PRICE:",
            validProducts[0]?.price
          );
        }

        // =====================================================
        // SET PRODUCTS
        // =====================================================

        if (mounted) {
          setProducts(validProducts);
        }

      } catch (error) {

        console.error(
          "ERROR FETCHING PRODUCTS:",
          error
        );

        if (mounted) {

          setProducts([]);

          setError(
            error?.message ||
              "Failed to load products"
          );
        }

      } finally {

        if (mounted) {
          setLoading(false);
        }

      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };

  }, []);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <section className="product-section">

        <div className="product-section-header">

          <h2>
            Best Deals
          </h2>

        </div>

        <div className="products-grid">

          <p>
            Loading products...
          </p>

        </div>

      </section>
    );

  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {

    return (
      <section className="product-section">

        <div className="product-section-header">

          <h2>
            Best Deals
          </h2>

        </div>

        <div className="products-grid">

          <p className="no-products">
            {error}
          </p>

        </div>

      </section>
    );

  }

  // =========================================================
  // NO PRODUCTS
  // =========================================================

  if (
    !Array.isArray(products) ||
    products.length === 0
  ) {

    return (
      <section className="product-section">

        <div className="product-section-header">

          <h2>
            Best Deals
          </h2>

        </div>

        <div className="products-grid">

          <p className="no-products">
            No products available
          </p>

        </div>

      </section>
    );

  }

  // =========================================================
  // DISPLAY PRODUCTS
  // =========================================================

  console.log(
    "RENDERING PRODUCT SECTION:",
    products.length
  );

  return (
    <ProductSection
      title="Best Deals"
      products={products}
    />
  );
}

export default ProductSections;