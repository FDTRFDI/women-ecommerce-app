import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://backend-women-ecommerce.onrender.com";

function ProductManager() {
  // =========================================================
  // STATE
  // =========================================================

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const [colorInput, setColorInput] = useState("");
  const [colors, setColors] = useState([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================================================
  // GET TOKEN
  // =========================================================

  const getToken = () => {
    try {
      const admin = localStorage.getItem("admin");

      if (!admin) return null;

      const parsed = JSON.parse(admin);

      return parsed?.token || null;
    } catch (err) {
      console.error("Token error:", err);
      return null;
    }
  };

  // =========================================================
  // GET ALL PRODUCTS
  // =========================================================

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);

      const response = await axios.get(`${API}/api/products`);

      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.products)
        ? data.products
        : [];

      setProducts(list);
    } catch (err) {
      console.error("GET PRODUCTS ERROR:", err);

      setProducts([]);

      setError("Error loading products");
    } finally {
      setLoadingProducts(false);
    }
  };

  // =========================================================
  // LOAD PRODUCTS
  // =========================================================

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================================================
  // ADD COLOR
  // =========================================================

  const addColor = () => {
    const color = colorInput.trim();

    if (!color) return;

    if (colors.includes(color)) {
      setColorInput("");
      return;
    }

    setColors((prev) => [...prev, color]);

    setColorInput("");
  };

  // =========================================================
  // REMOVE COLOR
  // =========================================================

  const removeColor = (colorToRemove) => {
    setColors((prev) =>
      prev.filter((color) => color !== colorToRemove)
    );
  };

  // =========================================================
  // ADD PRODUCT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    if (!name.trim()) {
      setError("Please enter product name");
      return;
    }

    if (!price || Number(price) < 0) {
      setError("Please enter a valid price");
      return;
    }

    if (!mainImage) {
      setError("Please select a main image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      // IMPORTANT:
      // These names MUST match the backend:
      // image
      // images
      // colors

      formData.append("name", name.trim());

      formData.append("price", price);

      formData.append(
        "description",
        description.trim()
      );

      // MAIN IMAGE
      formData.append("image", mainImage);

      // GALLERY
      galleryImages.forEach((file) => {
        formData.append("images", file);
      });

      // COLORS
      formData.append(
        "colors",
        JSON.stringify(colors)
      );

      const token = getToken();

      const response = await axios.post(
        `${API}/api/products`,
        formData,
        {
          headers: {
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      console.log(
        "PRODUCT CREATED:",
        response.data
      );

      setMessage("Product added successfully");

      // -------------------------------------------------------
      // CLEAR FORM
      // -------------------------------------------------------

      setName("");
      setPrice("");
      setDescription("");

      setMainImage(null);
      setGalleryImages([]);

      setColors([]);
      setColorInput("");

      // Reset file inputs
      const fileInputs =
        document.querySelectorAll(
          'input[type="file"]'
        );

      fileInputs.forEach((input) => {
        input.value = "";
      });

      // -------------------------------------------------------
      // IMPORTANT
      // GET PRODUCTS AGAIN
      // -------------------------------------------------------

      await fetchProducts();

    } catch (err) {
      console.error(
        "ADD PRODUCT ERROR:",
        err
      );

      console.error(
        "SERVER RESPONSE:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          "Error saving product"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // DELETE PRODUCT
  // =========================================================

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const token = getToken();

      await axios.delete(
        `${API}/api/products/${id}`,
        {
          headers: {
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      setMessage("Product deleted successfully");

      // Refresh list
      await fetchProducts();

    } catch (err) {
      console.error(
        "DELETE PRODUCT ERROR:",
        err
      );

      console.error(
        "SERVER RESPONSE:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          "Error deleting product"
      );
    }
  };

  // =========================================================
  // IMAGE URL
  // =========================================================

  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${API}${image}`;
    }

    return `${API}/uploads/${image}`;
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >

      {/* =====================================================
          TITLE
      ===================================================== */}

      <h1
        style={{
          marginBottom: "10px",
        }}
      >
        Manage Products
      </h1>

      <p
        style={{
          marginBottom: "25px",
          color: "#555",
        }}
      >
        Add products that appear directly on your store.
      </p>

      {/* =====================================================
          REFRESH
      ===================================================== */}

      <button
        type="button"
        onClick={fetchProducts}
        disabled={loadingProducts}
        style={{
          marginBottom: "20px",
          padding: "10px 18px",
          border: "none",
          borderRadius: "6px",
          background: "#007bff",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {loadingProducts
          ? "Loading..."
          : "Refresh"}
      </button>

      {/* =====================================================
          MESSAGE
      ===================================================== */}

      {message && (
        <div
          style={{
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "6px",
            background: "#d4edda",
            color: "#155724",
          }}
        >
          {message}
        </div>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div
          style={{
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "6px",
            background: "#f8d7da",
            color: "#721c24",
          }}
        >
          {error}
        </div>
      )}

      {/* =====================================================
          ADD PRODUCT FORM
      ===================================================== */}

      <div
        style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "10px",
          boxShadow:
            "0 2px 12px rgba(0,0,0,0.08)",
          marginBottom: "40px",
        }}
      >

        <h2>Add Product</h2>

        <form onSubmit={handleSubmit}>

          {/* PRODUCT NAME */}

          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Product Name</strong>
            </label>

            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* PRICE */}

          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Price</strong>
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Price"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* DESCRIPTION */}

          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Description</strong>
            </label>

            <textarea
              placeholder="Product Description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows="5"
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* =================================================
              MAIN IMAGE
          ================================================= */}

          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Main Image</strong>
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setMainImage(
                  e.target.files?.[0] || null
                )
              }
              style={{
                display: "block",
                marginTop: "8px",
              }}
            />

            {mainImage && (
              <small>
                Selected: {mainImage.name}
              </small>
            )}
          </div>

          {/* =================================================
              GALLERY
          ================================================= */}

          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Gallery Images</strong>
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setGalleryImages(
                  Array.from(
                    e.target.files || []
                  )
                )
              }
              style={{
                display: "block",
                marginTop: "8px",
              }}
            />

            {galleryImages.length > 0 && (
              <div
                style={{
                  marginTop: "8px",
                }}
              >
                {galleryImages.length} gallery image(s)
                selected
              </div>
            )}
          </div>

          {/* =================================================
              COLORS
          ================================================= */}

          <div style={{ marginBottom: "20px" }}>
            <label>
              <strong>Colors</strong>
            </label>

            <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop: "8px",
              }}
            >
              <input
                type="text"
                placeholder="Add Color"
                value={colorInput}
                onChange={(e) =>
                  setColorInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addColor();
                  }
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                }}
              />

              <button
                type="button"
                onClick={addColor}
                style={{
                  padding: "10px 18px",
                  border: "none",
                  borderRadius: "5px",
                  background: "#007bff",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Add
              </button>
            </div>

            {/* COLORS LIST */}

            {colors.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: "12px",
                }}
              >
                {colors.map((color) => (
                  <span
                    key={color}
                    style={{
                      background: "#007bff",
                      color: "#fff",
                      padding:
                        "5px 10px",
                      borderRadius: "15px",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      removeColor(color)
                    }
                    title="Click to remove"
                  >
                    {color} ×
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* =================================================
              SUBMIT
          ================================================= */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "6px",
              background: "#28a745",
              color: "#fff",
              fontSize: "16px",
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Adding Product..."
              : "Add Product"}
          </button>

        </form>
      </div>

      {/* =====================================================
          PRODUCTS LIST
      ===================================================== */}

      <div>

        <h2>Products List</h2>

        <p
          style={{
            color: "#555",
            marginBottom: "15px",
          }}
        >
          All products added to the store.
        </p>

        {loadingProducts ? (

          <p>Loading products...</p>

        ) : products.length === 0 ? (

          <div
            style={{
              padding: "25px",
              background: "#fff",
              borderRadius: "8px",
            }}
          >
            No products found.
          </div>

        ) : (

          <div
            style={{
              overflowX: "auto",
              background: "#fff",
              borderRadius: "8px",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.06)",
            }}
          >

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >

              <thead>
                <tr
                  style={{
                    background: "#f5f5f5",
                  }}
                >
                  <th
                    style={{
                      padding: "14px",
                      textAlign: "left",
                    }}
                  >
                    Image
                  </th>

                  <th
                    style={{
                      padding: "14px",
                      textAlign: "left",
                    }}
                  >
                    Title
                  </th>

                  <th
                    style={{
                      padding: "14px",
                      textAlign: "left",
                    }}
                  >
                    Price
                  </th>

                  <th
                    style={{
                      padding: "14px",
                      textAlign: "left",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>

                {products.map((product) => (

                  <tr
                    key={product.id}
                    style={{
                      borderTop:
                        "1px solid #eee",
                    }}
                  >

                    {/* IMAGE */}

                    <td
                      style={{
                        padding: "12px",
                      }}
                    >

                      {product.image ? (

                        <img
                          src={getImageUrl(
                            product.image
                          )}
                          alt={product.name}
                          style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "cover",
                            borderRadius: "6px",
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

                    <td
                      style={{
                        padding: "12px",
                      }}
                    >
                      {product.name}
                    </td>

                    {/* PRICE */}

                    <td
                      style={{
                        padding: "12px",
                      }}
                    >
                      AED{" "}
                      {Number(
                        product.price || 0
                      ).toFixed(2)}
                    </td>

                    {/* ACTIONS */}

                    <td
                      style={{
                        padding: "12px",
                      }}
                    >

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            product.id
                          )
                        }
                        style={{
                          padding:
                            "8px 14px",
                          border: "none",
                          borderRadius: "5px",
                          background:
                            "#dc3545",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default ProductManager;