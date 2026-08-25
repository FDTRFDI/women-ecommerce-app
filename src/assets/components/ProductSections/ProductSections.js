import React, { useEffect, useState } from "react";
import ProductSection from "./ProductSection";

const API = "https://backend-women-ecommerce.onrender.com";

function ProductSections() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // GET ALL CATEGORY PRODUCTS
  // =========================================================
  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

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
        } else if (
          data &&
          Array.isArray(data.category_products)
        ) {
          list = data.category_products;
        } else if (
          data &&
          data.data &&
          Array.isArray(data.data.products)
        ) {
          list = data.data.products;
        } else if (
          data &&
          data.data &&
          Array.isArray(data.data.category_products)
        ) {
          list = data.data.category_products;
        }

        console.log(
          "NORMALIZED PRODUCTS:",
          list
        );

        console.log(
          "PRODUCT COUNT:",
          list.length
        );

        // =====================================================
        // VALIDATE PRODUCTS
        // =====================================================

        const validProducts = list.filter(
          (product) =>
            product &&
            typeof product === "object" &&
            !Array.isArray(product)
        );

        console.log(
          "VALID PRODUCTS:",
          validProducts
        );

        console.log(
          "VALID PRODUCT COUNT:",
          validProducts.length
        );

        // =====================================================
        // SHOW FIRST PRODUCT FOR DEBUGGING
        // =====================================================

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
            "FIRST PRODUCT TITLE:",
            validProducts[0]?.title
          );

          console.log(
            "FIRST PRODUCT IMAGE:",
            validProducts[0]?.main_image ||
              validProducts[0]?.image
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
          "ERROR FETCHING CATEGORY PRODUCTS:",
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
          <h2>Best Deals</h2>
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
          <h2>Best Deals</h2>
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
    console.warn(
      "ProductSections: Backend returned 0 valid products."
    );

    return (
      <section className="product-section">

        <div className="product-section-header">
          <h2>Best Deals</h2>
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