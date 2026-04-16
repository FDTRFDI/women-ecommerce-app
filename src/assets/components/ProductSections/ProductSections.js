import React, { useEffect, useState } from "react";
import ProductSection from "./ProductSection";

const API = "https://backend-women-ecommerce-2.onrender.com";

const ProductSections = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.log("Not array:", data);
          setProducts([]);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // ⭐ Best Deals = أرخص 100 منتج
  const bestDeals = [...products]
    .sort((a, b) => a.price - b.price)
    .slice(0, 100);

  return (
    <div>
      <ProductSection
        title="Best Deals"
        products={bestDeals}
      />
    </div>
  );
};

export default ProductSections;
