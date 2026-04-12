import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../../../context/CartContext";
import { FiShoppingCart, FiUser, FiPackage } from "react-icons/fi";

function UserMenus() {
  const { totalQuantity } = useContext(CartContext);

  return (
    <div className="header-actions">

      {/* Orders */}
      <Link to="/orders" className="icon-btn" title="My Orders">
        <FiPackage />
      </Link>

      {/* Cart */}
      <Link to="/cart" className="icon-btn cart-icon" title="Cart">
        <FiShoppingCart />
        {totalQuantity > 0 && (
          <span className="cart-count">{totalQuantity}</span>
        )}
      </Link>

      {/* Login */}
      <Link to="/login" className="login-btn">
        <FiUser style={{ marginRight: "6px" }} />
        Login
      </Link>

    </div>
  );
}

export default UserMenus;