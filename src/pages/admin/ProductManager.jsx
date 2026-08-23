import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import "./admin.css";

const API = "https://backend-women-ecommerce.onrender.com";
const ProductManager = () => {
  const emptyForm = {
    name: "",
    price: "",
    description: "",
    image: null,
    images: [],
    colors: [],
  };

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const [colorInput, setColorInput] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed.token) setToken(parsed.token);
    }

    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/products");
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else if (e.target.name === "images") {
      setForm({ ...form, images: [...e.target.files] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addColor = () => {
    if (colorInput.trim() !== "") {
      setForm({ ...form, colors: [...form.colors, colorInput] });
      setColorInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Login required");
      return;
    }

    if (!form.name || !form.price) {
      setError("Name and price are required");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("description", form.description);

      if (form.image) formData.append("image", form.image);

      form.images.forEach((img) => {
        formData.append("images", img);
      });

      formData.append("colors", JSON.stringify(form.colors));

      if (editingId) {
        await axios.put(`/api/admin/products/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/api/admin/products", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setForm(emptyForm);
      setEditingId(null);
      setError("");
      fetchProducts();
    } catch (err) {
      console.error("Error submitting product:", err);
      setError("Server error while saving product");
    }
  };

  const editProduct = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: p.price,
      description: p.description,
      image: null,
      images: [],
      colors: Array.isArray(p.colors) ? p.colors : [],
    });
  };

  const deleteProduct = async (id) => {
    if (!token) return alert("Login required");

    if (window.confirm("Delete product?")) {
      try {
        await axios.delete(`/api/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchProducts();
      } catch (err) {
        console.error(err);
        alert("Error deleting product");
      }
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h1 className="admin-title">Manage Products</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>{editingId ? "Edit Product" : "Add Product"}</h2>

        <input name="name" placeholder="Product Title" value={form.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />

        <input type="text" name="price" placeholder="Price" value={form.price} onChange={handleChange} required />

        <label>Main Image</label>
        <input type="file" name="image" onChange={handleChange} />

        <label>Gallery Images</label>
        <input type="file" name="images" multiple onChange={handleChange} />

        <h3>Colors</h3>
        <div className="admin-forms-row">
          <input value={colorInput} onChange={(e) => setColorInput(e.target.value)} placeholder="Add Color" />
          <button type="button" onClick={addColor}>Add</button>
        </div>

        <div className="tag-list">
          {form.colors.map((c, i) => (
            <span key={i} className="tag">{c}</span>
          ))}
        </div>

        <button type="submit" className="btn success">
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      <h2 className="admin-section-title">Products List</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Img</th>
            <th>Title</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                {p.image && <img src={`${API}${p.image}`} width="60" />}
              </td>
              <td>{p.name}</td>
              <td>{p.price}</td>

              <td>
                <button className="btn primary small" onClick={() => editProduct(p)}>Edit</button>
                <button className="btn danger small" onClick={() => deleteProduct(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default ProductManager;
