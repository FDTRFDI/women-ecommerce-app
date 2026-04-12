import { useNavigate } from "react-router-dom";
import "./HomeCategories.css";

function HomeCategories() {

  const navigate = useNavigate();

  const categories = [
    { id: 44, title: "Makeup", image: "/product-1/1.png" },
    { id: 45, title: "Skincare", image: "/product-1/2.png" },
    { id: 46, title: "Fragrance", image: "/product-1/3.png" },
    { id: 47, title: "Hair Care", image: "/product-1/4.png" },
    { id: 48, title: "Beauty Tools", image: "/product-1/5.png" }
  ];

  return (
    <div className="main-home-page">

      <div className="categories-header">
        <h2>✨ Explore the category that inspires you and begin your beauty journey</h2>
      </div>

      <div className="categories-row">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="category-card"
            onClick={() => navigate(`/category/${cat.id}`)}
          >

            <img src={cat.image} alt={cat.title} />

            <span className="explore-text">Explore</span>

            <h3>{cat.title}</h3>

            <button>View All</button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default HomeCategories;