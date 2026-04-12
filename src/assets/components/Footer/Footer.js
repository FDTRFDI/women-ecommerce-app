import "./Footer.css";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaCcVisa,
  FaCcMastercard,
  FaCcApplePay
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">

      {/* Grid Sections */}
      <div className="footer-grid">

        {/* Company */}
        <div>
          <h4>Company</h4>
          <Link to="/">Home</Link>
          <Link to="#">About</Link>
          <Link to="#">Careers</Link>
        </div>

        {/* Support */}
        <div>
          <h4>Support</h4>
          <Link to="#">Help Center</Link>
          <Link to="#">Returns</Link>
          <Link to="#">Contact</Link>
        </div>

        {/* Legal */}
        <div>
          <h4>Legal</h4>
          <Link to="/legal/privacy">Privacy Policy</Link>
          <Link to="/legal/terms">Terms</Link>
          <Link to="/legal/refund">Refund Policy</Link>
          <Link to="/legal/cookies">Cookies</Link>
        </div>

        {/* Social */}
        <div>
          <h4>Follow Us</h4>
          <div className="social">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h4>Newsletter</h4>
          <p>Subscribe to get latest updates.</p>
          <form className="newsletter">
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>

      </div>

      {/* Payments / Trust */}
      <div className="payments">
        <FaCcVisa />
        <FaCcMastercard />
        <FaCcApplePay />
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} Omnera. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;