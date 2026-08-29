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
  const [loading, setLoading] = useState(false);

  const [colorInput, setColorInput] = useState("");

  // =====================================================
  // GET USER / TOKEN
  // =====================================================

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        const parsed = JSON.parse(savedUser);

        if (parsed?.token) {
          setToken(parsed.token);
        }
      }
    } catch (err) {
      console.error("Invalid user data:", err);
      localStorage.removeItem("user");
    }

    fetchProducts();
  }, []);

  // =====================================================
  // GET PRODUCTS
  // =====================================================

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/products");

      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : data?.products ||
          data?.data ||
          [];

      setProducts(Array.isArray(list) ? list : []);

    } catch (err) {
      console.error(
        "Error fetching products:",
        err
      );

      setProducts([]);
    }
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm((prev) => ({
        ...prev,
        image: files?.[0] || null,
      }));

      return;
    }

    if (name === "images") {
      setForm((prev) => ({
        ...prev,
        images: files
          ? Array.from(files)
          : [],
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // ADD COLOR
  // =====================================================

  const addColor = () => {
    const color = colorInput.trim();

    if (!color) return;

    setForm((prev) => ({
      ...prev,
      colors: [
        ...prev.colors,
        color,
      ],
    }));

    setColorInput("");
  };

  // =====================================================
  // REMOVE COLOR
  // =====================================================

  const removeColor = (index) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // =====================================================
  // SUBMIT PRODUCT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!token) {
      setError(
        "Admin login required. Please login again."
      );
      return;
    }

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.price) {
      setError("Product price is required.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append(
        "name",
        form.name.trim()
      );

      formData.append(
        "price",
        form.price
      );

      formData.append(
        "description",
        form.description.trim()
      );

      // =================================================
      // MAIN IMAGE
      // =================================================

      if (form.image) {
        formData.append(
          "image",
          form.image
        );
      }

      // =================================================
      // GALLERY IMAGES
      // =================================================

      if (
        Array.isArray(form.images) &&
        form.images.length > 0
      ) {
        form.images.forEach((img) => {
          formData.append(
            "images",
            img
          );
        });
      }

      // =================================================
      // COLORS
      // =================================================

      formData.append(
        "colors",
        JSON.stringify(form.colors)
      );

      console.log(
        "================================"
      );

      console.log(
        editingId
          ? "UPDATING PRODUCT"
          : "CREATING PRODUCT"
      );

      console.log(
        "PRODUCT:",
        form.name
      );

      console.log(
        "PRICE:",
        form.price
      );

      console.log(
        "COLORS:",
        form.colors
      );

      console.log(
        "================================"
      );

      // =================================================
      // UPDATE
      // =================================================

      if (editingId) {
        await axios.put(
          `/admin/products/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert(
          "Product updated successfully ✅"
        );
      }

      // =================================================
      // CREATE
      // =================================================

      else {
        await axios.post(
          "/admin/products",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert(
          "Product added successfully ✅"
        );
      }

      // =================================================
      // RESET
      // =================================================

      setForm(emptyForm);
      setEditingId(null);
      setColorInput("");
      setError("");

      await fetchProducts();

    } catch (err) {
      console.error(
        "Error submitting product:",
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

      const serverMessage =
        err.response?.data?.message ||
        err.response?.data?.error;

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        setError(
          "Admin authentication failed. Please login again."
        );
      } else if (
        err.response?.status === 404
      ) {
        setError(
          "Product API route not found. Check the backend admin product route."
        );
      } else {
        setError(
          serverMessage ||
            "Server error while saving product."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // EDIT PRODUCT
  // =====================================================

  const editProduct = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name || "",
      price: product.price || "",
      description:
        product.description || "",
      image: null,
      images: [],
      colors: Array.isArray(
        product.colors
      )
        ? product.colors
        : [],
    });

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setColorInput("");
    setError("");
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const deleteProduct = async (id) => {
    if (!token) {
      alert(
        "Admin login required."
      );
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmed) return;

    try {
      await axios.delete(
        `/admin/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        "Product deleted successfully ✅"
      );

      await fetchProducts();

    } catch (err) {
      console.error(
        "Error deleting product:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Error deleting product."
      );
    }
  };

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${API}${image}`;
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="admin-dashboard-container">

      <h1 className="admin-title">
        Manage Products
      </h1>

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      {/* =================================================
          PRODUCT FORM
      ================================================= */}

      <form
        className="admin-form"
        onSubmit={handleSubmit}
      >

        <h2>
          {editingId
            ? "Edit Product"
            : "Add Product"}
        </h2>

        {/* NAME */}

        <label>
          Product Name
        </label>

        <input
          type="text"
          name="name"
          placeholder="Product Title"
          value={form.name}
          onChange={handleChange}
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

        {/* MAIN IMAGE */}

        <label>
          Main Image
        </label>

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        {/* GALLERY */}

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

        {/* COLORS */}

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
                key={index}
                className="tag"
              >
                {color}

                <button
                  type="button"
                  onClick={() =>
                    removeColor(index)
                  }
                  style={{
                    marginLeft: "8px",
                    cursor: "pointer",
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
              className="btn danger"
              onClick={cancelEdit}
              disabled={loading}
            >
              Cancel
            </button>
          )}

        </div>

      </form>

      {/* =================================================
          PRODUCTS LIST
      ================================================= */}

      <h2 className="admin-section-title">
        Products List
      </h2>

      <div className="admin-table-wrapper">

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

            {products.length === 0 ? (

              <tr>

                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                  }}
                >
                  No products found
                </td>

              </tr>

            ) : (

              products.map(
                (product) => (

                  <tr
                    key={product.id}
                  >

                    <td>

                      {product.image ? (

                        <img
                          src={getImageUrl(
                            product.image
                          )}
                          alt={
                            product.name ||
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
                        />

                      ) : (

                        <span>
                          No Image
                        </span>

                      )}

                    </td>

                    <td>
                      {product.name}
                    </td>

                    <td>
                      AED{" "}
                      {product.price}
                    </td>

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

                )
              )

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default ProductManager;