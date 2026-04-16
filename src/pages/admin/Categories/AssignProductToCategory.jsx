import { useEffect, useState } from "react";
import "./AssignProductToCategory.css";

const API = "https://backend-women-ecommerce-2.onrender.com";

function AssignProductToCategory() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch products
  useEffect(() => {
    fetch(`${API}/api/category-products`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // Fetch categories
  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          setCategories([]);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleAssign = async () => {
    if (!selectedProduct || !selectedCategory) {
      alert("Please select both product and category");
      return;
    }

    try {
      const res = await fetch(`${API}/api/category-products/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: selectedProduct,
          category_id: selectedCategory,
        }),
      });

      const data = await res.json();

      alert("Product Assigned Successfully");

      console.log(data);

      setSelectedProduct("");
      setSelectedCategory("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="assign-page">
      <h2>Assign Product to Category</h2>

      <div className="assign-box">
        {/* Product */}
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">Select Product</option>

          {products.map((p) => (
            <option key={p.id || p._id} value={p.id || p._id}>
              {p.title}
            </option>
          ))}
        </select>

        {/* Category */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>

          {categories.map((c) => (
            <option key={c.id || c._id} value={c.id || c._id}>
              {c.title}
            </option>
          ))}
        </select>

        <button onClick={handleAssign} className="assign-btn">
          Assign Product
        </button>
      </div>
    </div>
  );
}

export default AssignProductToCategory;
