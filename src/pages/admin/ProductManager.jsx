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
    image: null,
    images: [],
    colors: [],
  };

  // =========================================================
  // STATES
  // =========================================================
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [token, setToken] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [colorInput, setColorInput] = useState("");

  // =========================================================
  // GET ADMIN TOKEN
  // =========================================================
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);

        if (parsed.token) {
          setToken(parsed.token);
        }
      } catch (error) {
        console.error("Error reading saved user:", error);
      }
    }

    fetchProducts();
    fetchCategories();
  }, []);

  // =========================================================
  // GET ALL PRODUCTS
  // =========================================================
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${API}/api/category-products`
      );

      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.products)
        ? data.products
        : [];

      setProducts(list);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // =========================================================
  // GET ALL CATEGORIES
  // =========================================================
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);

      const response = await axios.get(
        `${API}/api/categories`
      );

      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.categories)
        ? data.categories
        : [];

      setCategories(list);
    } catch (error) {
      console.error("Error fetching categories:", error);

      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // MAIN IMAGE
    if (name === "image") {
      setForm((prev) => ({
        ...prev,
        image: files && files.length > 0 ? files[0] : null,
      }));

      return;
    }

    // GALLERY IMAGES
    if (name === "images") {
      setForm((prev) => ({
        ...prev,
        images: files ? Array.from(files) : [],
      }));

      return;
    }

    // NORMAL INPUT
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // ADD COLOR
  // =========================================================
  const addColor = () => {
    const color = colorInput.trim();

    if (!color) {
      return;
    }

    // Prevent duplicate colors
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

    // =======================================================
    // LOGIN CHECK
    // =======================================================
    if (!token) {
      setError("Login required");
      return;
    }

    // =======================================================
    // VALIDATION
    // =======================================================
    if (!form.title.trim()) {
      setError("Product title is required");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      setError("Please enter a valid price");
      return;
    }

    if (!form.category_id) {
      setError("Please select a category");
      return;
    }

    try {
      setLoading(true);

      // =====================================================
      // FORM DATA
      // =====================================================
      const formData = new FormData();

      formData.append("title", form.title.trim());

      formData.append(
        "price",
        String(form.price)
      );

      formData.append(
        "description",
        form.description || ""
      );

      formData.append(
        "category_id",
        String(form.category_id)
      );

      // =====================================================
      // MAIN IMAGE
      // Backend expects: main_image
      // =====================================================
      if (form.image) {
        formData.append(
          "main_image",
          form.image
        );
      }

      // =====================================================
      // GALLERY
      // Backend expects: gallery
      // =====================================================
      form.images.forEach((image) => {
        formData.append(
          "gallery",
          image
        );
      });

      // =====================================================
      // COLORS
      //
      // IMPORTANT:
      // Backend expects repeated "colors" fields.
      //
      // Don't send JSON.stringify here.
      // =====================================================
      form.colors.forEach((color) => {
        formData.append(
          "colors",
          color
        );
      });

      // =====================================================
      // DEBUG
      // =====================================================
      console.log(
        "================================"
      );

      console.log(
        editingId
          ? "UPDATING PRODUCT"
          : "CREATING PRODUCT"
      );

      console.log(
        "TITLE:",
        form.title
      );

      console.log(
        "PRICE:",
        form.price
      );

      console.log(
        "CATEGORY ID:",
        form.category_id
      );

      console.log(
        "COLORS:",
        form.colors
      );

      console.log(
        "MAIN IMAGE:",
        form.image
          ? form.image.name
          : "No image"
      );

      console.log(
        "GALLERY:",
        form.images.map(
          (image) => image.name
        )
      );

      console.log(
        "================================"
      );

      // =====================================================
      // UPDATE
      // =====================================================
      if (editingId) {
        await axios.put(
          `${API}/api/category-products/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSuccess(
          "Product updated successfully"
        );
      }

      // =====================================================
      // ADD
      // =====================================================
      else {
        await axios.post(
          `${API}/api/category-products`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSuccess(
          "Product added successfully"
        );
      }

      // =====================================================
      // RESET FORM
      // =====================================================
      setForm(emptyForm);

      setEditingId(null);

      setColorInput("");

      // =====================================================
      // REFRESH PRODUCTS
      // =====================================================
      await fetchProducts();

    } catch (error) {
      console.error(
        "Error submitting product:",
        error
      );

      console.error(
        "STATUS:",
        error.response?.status
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.error;

      setError(
        serverMessage ||
          "Error saving product"
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // EDIT PRODUCT
  // =========================================================
  const editProduct = (product) => {
    setError("");
    setSuccess("");

    setEditingId(product.id);

    setForm({
      title:
        product.title ||
        product.name ||
        "",

      price:
        product.price !== null &&
        product.price !== undefined
          ? product.price
          : "",

      description:
        product.description ||
        "",

      category_id:
        product.category_id
          ? String(product.category_id)
          : "",

      image: null,

      images: [],

      colors:
        Array.isArray(product.colors)
          ? product.colors
          : [],
    });

    // Scroll to form
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
      alert("Login required");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await axios.delete(
        `${API}/api/category-products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(
        "Product deleted successfully"
      );

      await fetchProducts();

    } catch (error) {
      console.error(
        "Error deleting product:",
        error
      );

      console.error(
        "STATUS:",
        error.response?.status
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          "Error deleting product"
      );
    }
  };

  // =========================================================
  // GET PRODUCT IMAGE
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
  // GET CATEGORY NAME
  // =========================================================
  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (cat) =>
        Number(cat.id) ===
        Number(categoryId)
    );

    if (!category) {
      return "-";
    }

    return (
      category.title ||
      category.name ||
      "-"
    );
  };

  // =========================================================
  // PAGE
  // =========================================================
  return (
    <div className="admin-dashboard-container">

      {/* =====================================================
          TITLE
      ====================================================== */}
      <h1 className="admin-title">
        Manage Products
      </h1>

      {/* =====================================================
          ERROR
      ====================================================== */}
      {error && (
        <div
          style={{
            color: "#b91c1c",
            background: "#fee2e2",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "15px",
            fontWeight: "600",
          }}
        >
          {error}
        </div>
      )}

      {/* =====================================================
          SUCCESS
      ====================================================== */}
      {success && (
        <div
          style={{
            color: "#166534",
            background: "#dcfce7",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "15px",
            fontWeight: "600",
          }}
        >
          {success}
        </div>
      )}

      {/* =====================================================
          PRODUCT FORM
      ====================================================== */}
      <form
        className="admin-form"
        onSubmit={handleSubmit}
      >

        <h2>
          {editingId
            ? "Edit Product"
            : "Add Product"}
        </h2>

        {/* ===================================================
            PRODUCT TITLE
        ==================================================== */}
        <label>
          Product Name
        </label>

        <input
          type="text"
          name="title"
          placeholder="Product Name"
          value={form.title}
          onChange={handleChange}
          required
        />

        {/* ===================================================
            DESCRIPTION
        ==================================================== */}
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

        {/* ===================================================
            PRICE
        ==================================================== */}
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

        {/* ===================================================
            CATEGORY
        ==================================================== */}
        <label>
          Category
        </label>

        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          required
        >

          <option value="">
            {categoriesLoading
              ? "Loading categories..."
              : "Select Category"}
          </option>

          {categories.map(
            (category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.title ||
                  category.name ||
                  `Category ${category.id}`}
              </option>
            )
          )}

        </select>

        {/* ===================================================
            MAIN IMAGE
        ==================================================== */}
        <label>
          Main Image
        </label>

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        {form.image && (
          <small>
            Selected: {form.image.name}
          </small>
        )}

        {/* ===================================================
            GALLERY
        ==================================================== */}
        <label>
          Gallery Images
        </label>

        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleChange}
        />

        {form.images.length > 0 && (
          <small>
            {form.images.length} gallery image(s)
            selected
          </small>
        )}

        {/* ===================================================
            COLORS
        ==================================================== */}
        <h3>
          Colors
        </h3>

        <div className="admin-forms-row">

          <input
            type="text"
            value={colorInput}
            onChange={(e) =>
              setColorInput(
                e.target.value
              )
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
            onClick={addColor}
            className="btn primary"
          >
            Add
          </button>

        </div>

        {/* ===================================================
            COLOR TAGS
        ==================================================== */}
        <div className="tag-list">

          {form.colors.map(
            (color, index) => (
              <span
                key={`${color}-${index}`}
                className="tag"
                style={{
                  cursor: "pointer",
                }}
                onClick={() =>
                  removeColor(index)
                }
                title="Click to remove"
              >
                {color} ×
              </span>
            )
          )}

        </div>

        {/* ===================================================
            SUBMIT
        ==================================================== */}
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

        {/* ===================================================
            CANCEL EDIT
        ==================================================== */}
        {editingId && (
          <button
            type="button"
            className="btn"
            onClick={cancelEdit}
            style={{
              marginLeft: "10px",
            }}
          >
            Cancel
          </button>
        )}

      </form>

      {/* =====================================================
          PRODUCTS LIST
      ====================================================== */}
      <h2 className="admin-section-title">
        Products List
      </h2>

      <table className="admin-table">

        <thead>

          <tr>

            <th>
              Img
            </th>

            <th>
              Title
            </th>

            <th>
              Category
            </th>

            <th>
              Price
            </th>

            <th>
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {products.length === 0 ? (

            <tr>

              <td
                colSpan="5"
                style={{
                  textAlign: "center",
                  padding: "30px",
                }}
              >
                No products found.
              </td>

            </tr>

          ) : (

            products.map(
              (product) => {

                const imageUrl =
                  getImage(product);

                return (
                  <tr
                    key={product.id}
                  >

                    {/* IMAGE */}
                    <td>

                      {imageUrl ? (

                        <img
                          src={imageUrl}
                          alt={
                            product.title ||
                            "Product"
                          }
                          width="60"
                          height="60"
                          style={{
                            objectFit:
                              "cover",
                            borderRadius:
                              "8px",
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
                      {product.title ||
                        product.name ||
                        "-"}
                    </td>

                    {/* CATEGORY */}
                    <td>
                      {getCategoryName(
                        product.category_id
                      )}
                    </td>

                    {/* PRICE */}
                    <td>
                      AED{" "}
                      {Number(
                        product.price || 0
                      ).toFixed(2)}
                    </td>

                    {/* ACTIONS */}
                    <td>

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

                    </td>

                  </tr>
                );
              }
            )

          )}

        </tbody>

      </table>

    </div>
  );
};

export default ProductManager;