import { Link } from "react-router-dom";
import logo from "../img/logo/logo.png"; // عدّل المسار حسب مكان الصورة عندك

function Logo() {
  return (
    <Link to="/" className="logo">
      <img src={logo} alt="Omnera Logo" />
    </Link>
  );
}

export default Logo;
