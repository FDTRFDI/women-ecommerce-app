// src/assets/components/NavDrob-Dwon/Navbar.jsx

import { useNavigate } from "react-router-dom";
import "./Nav.css";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <ul className="nav-links">

        <li className="nav-item" onClick={() => navigate("/category/44")}>
          <span className="nav-title">Makeup</span>
        </li>

        <li className="nav-item" onClick={() => navigate("/category/45")}>
          <span className="nav-title">Skincare</span>
        </li>

        <li className="nav-item" onClick={() => navigate("/category/46")}>
          <span className="nav-title">Fragrance</span>
        </li>

        <li className="nav-item" onClick={() => navigate("/category/47")}>
          <span className="nav-title">Hair Care</span>
        </li>

        <li className="nav-item" onClick={() => navigate("/category/48")}>
          <span className="nav-title">Beauty Tools</span>
        </li>

      </ul>
    </nav>
  );
}