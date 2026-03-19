import { Link } from "react-router-dom";
import "../App.css";
import defaultCcLogo from "../assets/cc.webp";
import globalData from "../content/settings/global.json";
import contactData from "../content/pages/contact.json";

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
          <img src={footer.ccLogo || defaultCcLogo} alt="Registered Charity" className="footer-cc-logo" />
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
          <div className="footer-links footer-contact-info">
            <div className="contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <span>{contactData.phone}</span>
            </div>
            <div className="contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span><a href={`mailto:${contactData.email}`}>{contactData.email}</a></span>
            </div>
            <div className="contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>{contactData.address}</span>
            </div>
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
