import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import "./admin.css";

const API = "https://backend-women-ecommerce.onrender.com";

const ProductManager = () => {
  // =========================================================
  // EMPTY FORM
  // =========================================================
  const emptyForm = {
    title: "",
    price: "",
    description: "",
    category_id: "",
    main_image: null,
    gallery: [],
    colors: [],
  };

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);
  const [token, setToken] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [colorInput, setColorInput] = useState("");

  // =========================================================
  // LOAD USER + PRODUCTS + CATEGORIES
  // =========================================================
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);

        if (parsed?.token) {
          setToken(parsed.token);
        }
      } catch (err) {
        console.error("Invalid user data:", err);
      }
    }

    fetchProducts();
    fetchCategories();
  }, []);

  // =========================================================
  // GET PRODUCTS
  // =========================================================
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);

      const { data } = await axios.get("/api/category-products");

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setProducts(list);
    } catch (err) {
      console.error("Error fetching category products:", err);

      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  // =========================================================
  // GET CATEGORIES
  // =========================================================
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);

      const { data } = await axios.get("/api/categories");

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.categories)
        ? data.categories
        : [];

      setCategories(list);
    } catch (err) {
      console.error("Error fetching categories:", err);

      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  // =========================================================
  // HANDLE INPUT
  // =========================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // MAIN IMAGE
  // =========================================================
  const handleMainImage = (e) => {
    const file = e.target.files?.[0] || null;

    setForm((prev) => ({
      ...prev,
      main_image: file,
    }));
  };

  // =========================================================
  // GALLERY
  // =========================================================
  const handleGallery = (e) => {
    const files = Array.from(e.target.files || []);

    setForm((prev) => ({
      ...prev,
      gallery: files,
    }));
  };

  // =========================================================
  // ADD COLOR
  // =========================================================
  const addColor = () => {
    const color = colorInput.trim();

    if (!color) return;

    if (form.colors.includes(color)) {
      setColorInput("");
      return;
    }

    setForm((prev) => ({
      ...prev,
      colors: [...prev.colors, color],
    }));

    setColorInput("");
  };

  // =========================================================
  // REMOVE COLOR
  // =========================================================
  const removeColor = (index) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  // =========================================================
  // SUBMIT PRODUCT
  // =========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // -------------------------------------------------------
    // LOGIN CHECK
    // -------------------------------------------------------
    if (!token) {
      setError("Admin login required.");
      return;
    }

    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------
    if (!form.title.trim()) {
      setError("Product title is required.");
      return;
    }

    if (!form.price) {
      setError("Product price is required.");
      return;
    }

    if (!form.category_id) {
      setError("Please select a category.");
      return;
    }

    // -------------------------------------------------------
    // CREATE FORM DATA
    // -------------------------------------------------------
    const formData = new FormData();

    formData.append("title", form.title.trim());

    formData.append(
      "price",
      form.price
    );

    formData.append(
      "description",
      form.description || ""
    );

    formData.append(
      "category_id",
      form.category_id
    );

    // -------------------------------------------------------
    // MAIN IMAGE
    // Backend expects:
    // main_image
    // -------------------------------------------------------
    if (form.main_image) {
      formData.append(
        "main_image",
        form.main_image
      );
    }

    // -------------------------------------------------------
    // GALLERY
    // Backend expects:
    // gallery
    // -------------------------------------------------------
    form.gallery.forEach((file) => {
      formData.append(
        "gallery",
        file
      );
    });

    // -------------------------------------------------------
    // COLORS
    // Backend accepts repeated colors
    // -------------------------------------------------------
    form.colors.forEach((color) => {
      formData.append(
        "colors",
        color
      );
    });

    try {
      setLoading(true);

      console.log("==============================");
      console.log(
        editingId
          ? "UPDATING CATEGORY PRODUCT"
          : "CREATING CATEGORY PRODUCT"
      );

      console.log("TITLE:", form.title);
      console.log("PRICE:", form.price);
      console.log("CATEGORY ID:", form.category_id);
      console.log("COLORS:", form.colors);
      console.log("MAIN IMAGE:", form.main_image);
      console.log("GALLERY:", form.gallery);
      console.log("==============================");

      // =====================================================
      // UPDATE
      // =====================================================
      if (editingId) {
        await axios.put(
          `/api/category-products/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSuccess(
          "Product updated successfully."
        );
      }

      // =====================================================
      // ADD
      // =====================================================
      else {
        await axios.post(
          "/api/category-products",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSuccess(
          "Product added successfully."
        );
      }

      // =====================================================
      // RESET
      // =====================================================
      setForm(emptyForm);
      setEditingId(null);
      setColorInput("");

      // =====================================================
      // REFRESH PRODUCT LIST
      // =====================================================
      await fetchProducts();

    } catch (err) {
      console.error(
        "Error submitting category product:",
        err
      );

      console.error(
        "STATUS:",
        err.response?.status
      );

      console.error(
        "SERVER RESPONSE:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Server error while saving product."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // EDIT PRODUCT
  // =========================================================
  const editProduct = (product) => {
    setEditingId(product.id);

    let colors = [];

    if (Array.isArray(product.colors)) {
      colors = product.colors;
    }

    setForm({
      title:
        product.title ||
        "",

      price:
        product.price ||
        "",

      description:
        product.description ||
        "",

      category_id:
        product.category_id ||
        "",

      main_image: null,

      gallery: [],

      colors,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // CANCEL EDIT
  // =========================================================
  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setColorInput("");
    setError("");
    setSuccess("");
  };

  // =========================================================
  // DELETE PRODUCT
  // =========================================================
  const deleteProduct = async (id) => {
    if (!token) {
      alert("Admin login required.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `/api/category-products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts((prev) =>
        prev.filter(
          (product) =>
            Number(product.id) !== Number(id)
        )
      );

      setSuccess(
        "Product deleted successfully."
      );

    } catch (err) {
      console.error(
        "Error deleting product:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Error deleting product."
      );
    }
  };

  // =========================================================
  // IMAGE URL
  // =========================================================
  const getImage = (product) => {
    let image = "";

    if (product.main_image) {
      image = product.main_image;
    } else if (product.image) {
      image = product.image;
    } else if (
      Array.isArray(product.gallery) &&
      product.gallery.length > 0
    ) {
      image = product.gallery[0];
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
  // CATEGORY NAME
  // =========================================================
  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (cat) =>
        Number(cat.id) === Number(categoryId)
    );

    return (
      category?.title ||
      category?.name ||
      `Category ${categoryId || "-"}`
    );
  };

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <div className="admin-dashboard-container">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="admin-dashboard-header">

        <div>
          <h1 className="admin-title">
            Manage Products
          </h1>

          <p>
            Add products that appear directly inside
            your selected category.
          </p>
        </div>

        <button
          type="button"
          className="btn primary"
          onClick={() => {
            fetchProducts();
            fetchCategories();
          }}
        >
          Refresh
        </button>

      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}
      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      {/* =====================================================
          SUCCESS
      ===================================================== */}
      {success && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "20px",
            borderRadius: "8px",
            background: "#e8f8ee",
            color: "#187a3d",
            border: "1px solid #b8e5c8",
            fontWeight: "600",
          }}
        >
          {success}
        </div>
      )}

      {/* =====================================================
          FORM
      ===================================================== */}
      <form
        className="admin-form"
        onSubmit={handleSubmit}
      >

        <h2>
          {editingId
            ? "Edit Product"
            : "Add Product"}
        </h2>

        {/* TITLE */}
        <label>
          Product Title
        </label>

        <input
          type="text"
          name="title"
          placeholder="Product Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        {/* PRICE */}
        <label>
          Price
        </label>

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
        />

        {/* DESCRIPTION */}
        <label>
          Description
        </label>

        <textarea
          name="description"
          placeholder="Product Description"
          value={form.description}
          onChange={handleChange}
          rows="5"
        />

        {/* CATEGORY */}
        <label>
          Category
        </label>

        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          required
          disabled={loadingCategories}
        >

          <option value="">
            {loadingCategories
              ? "Loading categories..."
              : "Select Category"}
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.title ||
                category.name ||
                `Category ${category.id}`}
            </option>
          ))}

        </select>

        {/* MAIN IMAGE */}
        <label>
          Main Image
        </label>

        <input
          type="file"
          name="main_image"
          accept="image/*"
          onChange={handleMainImage}
        />

        {form.main_image && (
          <small>
            Selected: {form.main_image.name}
          </small>
        )}

        {/* GALLERY */}
        <label>
          Gallery Images
        </label>

        <input
          type="file"
          name="gallery"
          accept="image/*"
          multiple
          onChange={handleGallery}
        />

        {form.gallery.length > 0 && (
          <small>
            {form.gallery.length} gallery image(s)
            selected
          </small>
        )}

        {/* COLORS */}
        <h3>
          Colors
        </h3>

        <div className="admin-forms-row">

          <input
            type="text"
            value={colorInput}
            onChange={(e) =>
              setColorInput(e.target.value)
            }
            placeholder="Add Color"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addColor();
              }
            }}
          />

          <button
            type="button"
            className="btn primary"
            onClick={addColor}
          >
            Add
          </button>

        </div>

        {/* COLOR TAGS */}
        <div className="tag-list">

          {form.colors.map(
            (color, index) => (
              <span
                key={`${color}-${index}`}
                className="tag"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >

                {color}

                <button
                  type="button"
                  onClick={() =>
                    removeColor(index)
                  }
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  ×
                </button>

              </span>
            )
          )}

        </div>

        {/* BUTTONS */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
          }}
        >

          <button
            type="submit"
            className="btn success"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Product"
              : "Add Product"}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}

        </div>

      </form>

      {/* =====================================================
          PRODUCTS LIST
      ===================================================== */}
      <div className="admin-dashboard-header">

        <div>
          <h2 className="admin-section-title">
            Products List
          </h2>

          <p>
            Products stored in category_products.
          </p>
        </div>

      </div>

      <div className="admin-table-wrapper">

        <table className="admin-table">

          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {loadingProducts ? (

              <tr>
                <td colSpan="5">
                  Loading products...
                </td>
              </tr>

            ) : products.length === 0 ? (

              <tr>
                <td colSpan="5">
                  No products found.
                </td>
              </tr>

            ) : (

              products.map((product) => {

                const imageUrl =
                  getImage(product);

                return (
                  <tr key={product.id}>

                    {/* IMAGE */}
                    <td>

                      {imageUrl ? (

                        <img
                          src={imageUrl}
                          alt={
                            product.title ||
                            "Product"
                          }
                          width="70"
                          height="70"
                          style={{
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";
                          }}
                        />

                      ) : (

                        <span>
                          No Image
                        </span>

                      )}

                    </td>

                    {/* TITLE */}
                    <td>
                      {product.title || "-"}
                    </td>

                    {/* PRICE */}
                    <td>
                      {Number(
                        product.price || 0
                      ).toFixed(2)}{" "}
                      AED
                    </td>

                    {/* CATEGORY */}
                    <td>
                      {getCategoryName(
                        product.category_id
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td>

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >

                        <button
                          type="button"
                          className="btn primary small"
                          onClick={() =>
                            editProduct(
                              product
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn danger small"
                          onClick={() =>
                            deleteProduct(
                              product.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              })
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default ProductManager;