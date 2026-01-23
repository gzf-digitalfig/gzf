import { Link } from "react-router-dom";
import "../App.css";
import ccLogo from "../assets/cc.webp";
import globalData from "../content/settings/global.json";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { footer, siteTitle } = globalData;

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h4>{siteTitle}</h4>
          <p>
            {footer.text}
          </p>
          <p>
            Registered Charity No. {footer.charityNumber}
          </p>
          <img src={ccLogo} alt="Registered Charity" className="footer-cc-logo" />
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <div className="footer-links">
            {footer.links && footer.links.map((link, i) => (
              <Link key={i} to={link.url}>{link.label}</Link>
            ))}
          </div>
        </div>

        <div className="footer-section">
          <h4>Get in Touch</h4>
          <div className="footer-links">
            {footer.contactLinks && footer.contactLinks.map((link, i) => (
              <Link key={i} to={link.url}>{link.label}</Link>
            ))}
          </div>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <div className="footer-links">
            {footer.legalLinks && footer.legalLinks.map((link, i) => (
              <Link key={i} to={link.url}>{link.label}</Link>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {currentYear} {footer.copyright}</span>
        <span className="footer-separator"> | </span>
        <span className="footer-credit">Powered by <a href="https://digitalfig.com" target="_blank" rel="noopener noreferrer" style={{ color: '#374151', textDecoration: 'none', fontWeight: 'bold' }}>Digital Fig</a></span>
      </div>
    </footer>
  );
}
