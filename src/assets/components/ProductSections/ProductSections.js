import React, { useEffect, useState } from "react";
import ProductSection from "./ProductSection";

const ProductSections = () => {
  const [products, setProducts] = useState([]) ;

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
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

  // ⭐ Best Deals = أرخص 10 منتجات
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