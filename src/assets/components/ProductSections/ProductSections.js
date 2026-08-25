import React, { useEffect, useState } from "react";
import ProductSection from "./ProductSection";

const API = "https://backend-women-ecommerce.onrender.com";

function ProductSections() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // GET ALL CATEGORY PRODUCTS
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
        // NORMALIZE RESPONSE
        // =====================================================

        let list = [];

        if (Array.isArray(data)) {
          list = data;
        } else if (Array.isArray(data.data)) {
          list = data.data;
        } else if (Array.isArray(data.products)) {
          list = data.products;
        } else if (Array.isArray(data.category_products)) {
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
  // LOADING
  // =========================================================
  if (loading) {
    return (
      <section className="product-section">
        <div className="product-section-header">
          <h2>Best Deals</h2>
        </div>

        <div className="products-grid">
          <p>Loading products...</p>
        </div>
      </section>
    );
  }

  // =========================================================
  // NO PRODUCTS
  // =========================================================
  if (!products.length) {
    console.warn(
      "ProductSections: Backend returned 0 products."
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
  return (
    <ProductSection
      title="Best Deals"
      products={products}
    />
  );
}

export default ProductSections;