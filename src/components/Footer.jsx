import { Link } from "react-router-dom";
import "../App.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h4>Gloucester Zakat Fund</h4>
          <p>
            Collecting and distributing Zakat and Sadaqah to support our local community with transparency and care.
          </p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <div className="footer-links">
            <Link to="/about">About Us</Link>
            <Link to="/whatiszakat">What is Zakat</Link>
            <Link to="/apply">Apply for Support</Link>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Get in Touch</h4>
          <div className="footer-links">
            <Link to="/contact">Contact Us</Link>
            <Link to="/faq">FAQ</Link>
          </div>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        &copy; {currentYear} Gloucester Zakat Fund. All rights reserved.
      </div>
    </footer>
  );
}
