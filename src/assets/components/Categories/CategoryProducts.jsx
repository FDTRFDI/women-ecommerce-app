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

  // ==========================================
  // GET CATEGORY NAME
  // ==========================================
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
          setCategoryTitle(currentCategory.title);
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

  // ==========================================
  // GET PRODUCTS OF THIS CATEGORY
  // ==========================================
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
        setProducts([]);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  // ==========================================
  // PRODUCT IMAGE
  // ==========================================
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

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="category-products-page">
        <h2>Loading products...</h2>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================
  return (
    <div className="category-products-page">

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

      {error && (
        <p className="admin-error">
          {error}
        </p>
      )}

      {!error && products.length === 0 ? (
        <p>No products in this category yet.</p>
      ) : (
        <div className="products-grid">

          {products.map((product) => {

            /*
             * IMPORTANT
             *
             * Backend category_products returns:
             *
             * id
             * title
             * price
             * description
             * main_image
             * gallery
             * colors
             * category_id
             *
             * Therefore we MUST use product.id.
             */

            const productId = product.id;

            const imageUrl = getImage(product);

            return (
              <div
                key={productId}
                className="product-card"
              >

                {/* ==================================
                    PRODUCT CLICK AREA
                ================================== */}

                <div
                  className="click-area"
                  onClick={() =>
                    navigate(`/prodetails/${productId}`)
                  }
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

                {/* ==================================
                    ADD TO CART
                ================================== */}

                <button
                  className="add-btn"
                  onClick={(e) => {
                    e.stopPropagation();

                    addToCart({
                      id: productId,
                      product_id: productId,
                      name: product.title,
                      title: product.title,
                      price: Number(product.price),
                      image: imageUrl,
                    });
                  }}
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