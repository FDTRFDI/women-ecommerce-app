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

  // =========================================================
  // GET CATEGORY NAME
  // =========================================================
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(
          `${API}/api/categories`
        );

        if (!response.ok) {
          throw new Error("Failed to load categories");
        }

        const cats = await response.json();

        const list = Array.isArray(cats)
          ? cats
          : Array.isArray(cats.data)
          ? cats.data
          : Array.isArray(cats.categories)
          ? cats.categories
          : [];

        const current = list.find(
          (category) =>
            Number(category.id) === Number(id)
        );

        if (current) {
          setCategoryTitle(current.title);
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

  // =========================================================
  // GET PRODUCTS
  // =========================================================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API}/api/category-products/category/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = await response.json();

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];

        setProducts(list);

      } catch (error) {
        console.error("Products error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  // =========================================================
  // GET IMAGE
  // =========================================================
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

        if (
          Array.isArray(gallery) &&
          gallery.length > 0
        ) {
          path = gallery[0];
        }

      } catch (error) {
        console.error("Gallery parse error:", error);
      }
    }

    if (!path) {
      return "";
    }

    if (
      path.startsWith("http://") ||
      path.startsWith("https://")
    ) {
      return path;
    }

    if (path.startsWith("/")) {
      return `${API}${path}`;
    }

    return `${API}/${path}`;
  };

  // =========================================================
  // OPEN PRODUCT
  // =========================================================
  const openProduct = (product) => {

    /*
      مهم جدًا:

      category_products.id
      هو الـ ID الذي يجب إرساله إلى:

      /prodetails/:id

      وليس category_id
    */

    const productId = Number(product.id);

    if (!productId) {
      console.error(
        "Invalid product ID:",
        product
      );
      return;
    }

    navigate(`/prodetails/${productId}`);
  };

  // =========================================================
  // ADD TO CART
  // =========================================================
  const handleAddToCart = (event, product) => {

    event.stopPropagation();

    const productId = Number(product.id);

    const imageUrl = getImage(product);

    addToCart({
      product_id: productId,
      id: productId,
      title: product.title,
      name: product.title,
      price: Number(product.price),
      image: imageUrl,
    });
  };

  // =========================================================
  // LOADING
  // =========================================================
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

          <h2>
            {categoryTitle || "Products"}
          </h2>

        </div>

        <p>Loading products...</p>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================
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

      {/* NO PRODUCTS */}
      {products.length === 0 ? (

        <p>
          No products in this category yet.
        </p>

      ) : (

        <div className="products-grid">

          {products.map((product) => {

            /*
              استخدم id فقط

              لأن الـ backend يرجع:
              category_products.id
            */
            const productId = Number(product.id);

            const imageUrl = getImage(product);

            return (

              <div
                key={productId}
                className="product-card"
              >

                {/* CLICK AREA */}
                <div
                  className="click-area"
                  onClick={() =>
                    openProduct(product)
                  }
                >

                  {/* IMAGE */}
                  {imageUrl ? (

                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="category-product-img"
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";
                      }}
                    />

                  ) : (

                    <div className="no-image">
                      No Image
                    </div>

                  )}

                  {/* TITLE */}
                  <h4 className="product-title">
                    {product.title}
                  </h4>

                  {/* RATING */}
                  <div className="rating-stars">
                    ★★★★☆
                  </div>

                  {/* PRICE */}
                  <div className="price-row">

                    <p className="product-price">
                      {Number(product.price || 0).toFixed(2)} AED
                    </p>

                    {product.discount && (
                      <span className="discount-tag">
                        -{product.discount}%
                      </span>
                    )}

                  </div>

                </div>

                {/* ADD BUTTON */}
                <button
                  className="add-btn"
                  type="button"
                  onClick={(event) =>
                    handleAddToCart(
                      event,
                      product
                    )
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