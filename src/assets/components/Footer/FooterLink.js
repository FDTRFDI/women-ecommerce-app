import { Link } from "react-router-dom";

function FooterLink({ to, label }) {
  return (
    <Link to={to} className="footer-link">
      {label}
    </Link>
  );
}

export default FooterLink;