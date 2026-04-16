import { useEffect, useState } from "react";
import "./ProductsPage.css";

const API = "https://backend-women-ecommerce-2.onrender.com";

function ProductsPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category_id: "",
    colors: [],
    isFeatured: false,
  });

  const [colorInput, setColorInput] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [gallery, setGallery] = useState([]);

  // Fetch categories
  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
        else if (Array.isArray(data.data)) setCategories(data.data);
      });
  }, []);

  // Fetch products
  useEffect(() => {
    fetch(`${API}/api/category-products`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
        else if (Array.isArray(data.data)) setProducts(data.data);
      });
  }, []);

  const handleAddColor = () => {
    if (colorInput.trim() !== "") {
      setForm({ ...form, colors: [...form.colors, colorInput] });
      setColorInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("price", form.price);
    fd.append("category_id", form.category_id);
    fd.append("colors", JSON.stringify(form.colors));
    fd.append("is_featured", form.isFeatured);

    if (mainImage) fd.append("main_image", mainImage);
    gallery.forEach((img) => fd.append("gallery", img));

    const res = await fetch(`${API}/api/category-products`, {
      method: "POST",
      body: fd,
    });

    const newProduct = await res.json();

    setProducts([...products, newProduct]);

    setForm({
      title: "",
      description: "",
      price: "",
      category_id: "",
      colors: [],
      isFeatured: false,
    });

    setMainImage(null);
    setGallery([]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await fetch(`${API}/api/category-products/${id}`, {
      method: "DELETE",
    });

    setProducts(products.filter((p) => p.id !== id && p._id !== id));
  };

  return (
    <div className="products-page">

      <h2>Add Product</h2>

      <form onSubmit={handleSubmit} className="product-form">

        <input
          type="text"
          placeholder="Product Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <select
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id || cat._id} value={cat.id || cat._id}>
              {cat.title}
            </option>
          ))}
        </select>

        <label>Main Image</label>
        <input type="file" onChange={(e) => setMainImage(e.target.files[0])} />

        <label>Gallery Images</label>
        <input
          type="file"
          multiple
          onChange={(e) => setGallery([...e.target.files])}
        />

        <div className="colors-box">
          <input
            type="text"
            placeholder="Color name"
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
          />
          <button type="button" onClick={handleAddColor}>
            Add
          </button>
        </div>

        <div className="colors-list">
          {form.colors.map((c, i) => (
            <span key={i} className="color-tag">{c}</span>
          ))}
        </div>

        <label>
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) =>
              setForm({ ...form, isFeatured: e.target.checked })
            }
          />
          Feature on Home Page
        </label>

        <button type="submit" className="add-btn">Add Product</button>
      </form>

      <h2>Products List</h2>

      <table className="products-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id || p._id}>
              <td>
                <img
                  src={
                    p.main_image
                      ? `${API}${p.main_image}`
                      : p.image
                      ? `${API}${p.image}`
                      : p.image_url || p.mainImage
                  }
                  className="product-img"
                />
              </td>

              <td>{p.title}</td>
              <td>{p.price}.00</td>

              <td>
                <button className="edit-btn">Edit</button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(p.id || p._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default ProductsPage;
