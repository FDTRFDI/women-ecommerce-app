// src/pages/Admin/Categories.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/axios";
import "./Categories.css";

const API = "backend-women-ecommerce.onrender.com";

const Categories = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");

  const [mainImage, setMainImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("parent_id", parentId || null);

      if (mainImage) {
        formData.append("main_image", mainImage);
      } else {
        formData.append("keep_old_image", "true");
      }

      if (editingId) {
        await api.put(`/api/categories/${editingId}`, formData);
      } else {
        await api.post("/api/categories", formData);
      }

      setTitle("");
      setDescription("");
      setParentId("");
      setMainImage(null);
      setEditingId(null);

      fetchCategories();
    } catch (err) {
      console.error("Submit Error:", err);
      alert("Error submitting category");
    }
  };

  const editCategory = (cat) => {
    setEditingId(cat.id);
    setTitle(cat.title || "");
    setDescription(cat.description || "");
    setParentId(cat.parent_id || "");
    setMainImage(null);
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/api/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Error deleting category");
    }
  };

  return (
    <div className="admin-page">
      <h1>Categories Manager</h1>

      <div className="add-box">
        <h3>{editingId ? "Edit Category" : "Add Category"}</h3>

        <input
          type="text"
          placeholder="Category Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Parent Category</label>
        <select value={parentId} onChange={(e) => setParentId(e.target.value)}>
          <option value="">Main Category</option>
          {categories
            .filter((c) => c.id !== editingId)
            .map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
        </select>

        {editingId &&
          categories.find((c) => c.id === editingId)?.main_image && (
            <img
              src={`${API}${
                categories.find((c) => c.id === editingId).main_image
              }`}
              width="80"
              style={{ marginBottom: "10px", borderRadius: "6px" }}
              alt="current"
            />
          )}

        <label>Main Image</label>
        <input type="file" onChange={(e) => setMainImage(e.target.files[0])} />

        <button onClick={handleSubmit}>
          {editingId ? "Update Category" : "Add Category"}
        </button>
      </div>

      <h2>Categories List</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Main Img</th>
            <th>Title</th>
            <th>Description</th>
            <th>Parent</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td>
                {c.main_image && (
                  <img
                    src={`${API}${c.main_image}`}
                    width="60"
                    alt=""
                  />
                )}
              </td>

              <td>{c.title}</td>
              <td>{c.description}</td>

              <td>
                {c.parent_id
                  ? categories.find((p) => p.id === c.parent_id)?.title
                  : "—"}
              </td>

              <td>
                <button className="edit-btn" onClick={() => editCategory(c)}>
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteCategory(c.id)}
                >
                  Delete
                </button>
                <button
                  className="edit-btn"
                  onClick={() =>
                    navigate(`/admin/category-products/${c.id}`)
                  }
                >
                  View Products
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;
