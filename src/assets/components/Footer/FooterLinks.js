import FooterLink from "./FooterLink";

function FooterLinks() {
  return (
    <div className="footer-links">

      <div>
        <h4>Company</h4>
        <FooterLink to="/" label="Home" />
        <FooterLink to="#" label="About Us" />
        <FooterLink to="#" label="Careers" />
        <footer>
  <a href="/privacy">Privacy Policy</a>
  <a href="/terms">Terms & Conditions</a>
  <a href="/refund">Refund Policy</a>
  <a href="/cookies">Cookie Policy</a>
</footer>
      </div>

      <div>
        <h4>Support</h4>
        <FooterLink to="#" label="Help Center" />
        <FooterLink to="#" label="Returns" />
        <FooterLink to="#" label="Privacy Policy" />
      </div>

    </div>
  );
}

export default FooterLinks;