import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CategoryProducts.css";
import { CartContext } from "../../../context/CartContext";

const API = "https://backend-women-ecommerce.onrender.com";

function CategoryProducts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================
  // GET CATEGORY NAME
  // ============================
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`${API}/api/categories`);

        if (!res.ok) {
          throw new Error("Failed to load categories");
        }

        const data = await res.json();

        const categories = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.categories)
          ? data.categories
          : [];

        const currentCategory = categories.find(
          (category) => Number(category.id) === Number(id)
        );

        if (currentCategory) {
          setCategoryTitle(
            currentCategory.title || currentCategory.name || "Products"
          );
        } else {
          setCategoryTitle("Products");
        }
      } catch (error) {
        console.error("Category error:", error);
        setCategoryTitle("Products");
      }
    };

    fetchCategory();
  }, [id]);

  // ============================
  // GET PRODUCTS BY CATEGORY
  // ============================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${API}/api/category-products/category/${id}`
        );

        if (!res.ok) {
          throw new Error("Failed to load products");
        }

        const data = await res.json();

        const productList = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];

        setProducts(productList);
      } catch (error) {
        console.error("Products error:", error);
        setError("Unable to load products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProducts();
    }
  }, [id]);

  // ============================
  // IMAGE URL
  // ============================
  const getImage = (product) => {
    let path = "";

    if (product.main_image) {
      path = product.main_image;
    } else if (product.image) {
      path = product.image;
    } else if (product.gallery) {
      try {
        const gallery = Array.isArray(product.gallery)
          ? product.gallery
          : JSON.parse(product.gallery);

        if (gallery.length > 0) {
          path = gallery[0];
        }
      } catch (error) {
        console.error("Gallery error:", error);
      }
    }

    if (!path) {
      return "";
    }

    if (path.startsWith("http")) {
      return path;
    }

    if (path.startsWith("/")) {
      return `${API}${path}`;
    }

    return `${API}/${path}`;
  };

  // ============================
  // OPEN PRODUCT DETAILS
  // ============================
  const openProduct = (product) => {
    // IMPORTANT:
    // category_products uses "id"
    // We DO NOT use product_id or _id here.
    const productId = product.id;

    if (!productId) {
      console.error("Product ID missing:", product);
      return;
    }

    navigate(`/prodetails/${productId}`);
  };

  // ============================
  // ADD TO CART
  // ============================
  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    const productId = product.id;

    if (!productId) {
      console.error("Product ID missing:", product);
      return;
    }

    const imageUrl = getImage(product);

    addToCart({
      id: productId,
      product_id: productId,
      name: product.title,
      title: product.title,
      price: Number(product.price),
      image: imageUrl,
    });
  };

  // ============================
  // LOADING
  // ============================
  if (loading) {
    return (
      <div className="category-products-page">
        <div className="category-products-header">
          <button
            onClick={() => navigate(-1)}
            className="back-btn"
          >
            Back
          </button>

          <h2>{categoryTitle || "Products"}</h2>
        </div>

        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="category-products-page">

      {/* HEADER */}
      <div className="category-products-header">

        <button
          onClick={() => navigate(-1)}
          className="back-btn"
        >
          Back
        </button>

        <h2>
          {categoryTitle || "Products"}
        </h2>

      </div>

      {/* ERROR */}
      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* EMPTY */}
      {!error && products.length === 0 && (
        <p>
          No products in this category yet.
        </p>
      )}

      {/* PRODUCTS */}
      {products.length > 0 && (
        <div className="products-grid">

          {products.map((product) => {

            // IMPORTANT:
            // The correct ID is ONLY product.id
            const productId = product.id;

            const imageUrl = getImage(product);

            return (
              <div
                key={productId}
                className="product-card"
              >

                {/* CLICK AREA */}
                <div
                  className="click-area"
                  onClick={() => openProduct(product)}
                >

                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.title || "Product"}
                      className="category-product-img"
                    />
                  ) : (
                    <div className="no-image">
                      No Image
                    </div>
                  )}

                  <h4 className="product-title">
                    {product.title}
                  </h4>

                  <div className="rating-stars">
                    ★★★★☆
                  </div>

                  <div className="price-row">

                    <p className="product-price">
                      {product.price} AED
                    </p>

                    {product.discount && (
                      <span className="discount-tag">
                        -{product.discount}%
                      </span>
                    )}

                  </div>

                </div>

                {/* ADD TO CART */}
                <button
                  className="add-btn"
                  onClick={(e) =>
                    handleAddToCart(e, product)
                  }
                >
                  +
                </button>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default CategoryProducts;