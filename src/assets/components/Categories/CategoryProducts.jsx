import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CategoryProducts.css";
import { CartContext } from "../../../context/CartContext";

const API = "http://localhost:5000";

function CategoryProducts() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState("");

  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then((res) => res.json())
      .then((cats) => {
        const list = Array.isArray(cats)
          ? cats
          : Array.isArray(cats.data)
          ? cats.data
          : cats.categories || [];

        const current = list.find((c) => Number(c.id) === Number(id));
        if (current) setCategoryTitle(current.title);
      })
      .catch(() => setCategoryTitle("Products"));
  }, [id]);

  useEffect(() => {
    fetch(`${API}/api/category-products/category/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : data.data || []);
      });
  }, [id]);

  const getImage = (p) => {
    let path = "";

    if (p.main_image) path = p.main_image;
    else if (p.image) path = p.image;
    else if (p.gallery) {
      try {
        const gallery = Array.isArray(p.gallery)
          ? p.gallery
          : JSON.parse(p.gallery);
        if (gallery.length > 0) path = gallery[0];
      } catch {}
    }

    if (!path) return "";
    if (path.startsWith("http")) return path;
    if (path.startsWith("/")) return `${API}${path}`;
    return `${API}/${path}`;
  };

  return (
    <div className="category-products-page">
      <div className="category-products-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          Back
        </button>
        <h2>{categoryTitle || "Products"}</h2>
      </div>

      {products.length === 0 ? (
        <p>No products in this category yet.</p>
      ) : (
        <div className="products-grid">
          {products.map((p) => {
            const imageUrl = getImage(p);
            const productId = p.product_id || p.id || p._id;

            return (
              <div key={productId} className="product-card">
                
                {/* منطقة الضغط للانتقال للتفاصيل */}
                <div
                  className="click-area"
                  onClick={() => navigate(`/prodetails/${productId}`)}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={p.title}
                      className="category-product-img"
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}

                  <h4 className="product-title">{p.title}</h4>
                  <div className="rating-stars">★★★★☆</div>

                  <div className="price-row">
                    <p className="product-price">{p.price} AED</p>
                    {p.discount && (
                      <span className="discount-tag">-{p.discount}%</span>
                    )}
                  </div>
                </div>

                {/* زر الإضافة للسلة */}
                <button
                  className="add-btn"
                  onClick={(e) => {
                    e.stopPropagation();

                    addToCart({
                      product_id: productId,
                      title: p.title,
                      price: Number(p.price),
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