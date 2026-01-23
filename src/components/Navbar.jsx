import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/gzflogo.webp";
import "../App.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen &&
        !event.target.closest('.nav-links') &&
        !event.target.closest('.nav-toggle')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <nav>
      <div className="nav-container">
        <div className="nav-brand">
          <NavLink to="/" onClick={closeMenu}>
            <img
              src={logo}
              alt="Gloucester Zakat Fund Logo"
              style={{ height: 110, marginRight: 24, verticalAlign: 'middle' }}
            />
          </NavLink>
        </div>

        <button
          className={`nav-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span className="hamburger"></span>
        </button>

        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
          <NavLink to="/about" onClick={closeMenu}>About</NavLink>
          <NavLink to="/faq" onClick={closeMenu}>What is Zakat</NavLink>
          <NavLink to="/apply" onClick={closeMenu}>Apply</NavLink>
          <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
          <div className="nav-buttons-group">
            <NavLink to="/donate" className="btn btn-primary" onClick={closeMenu}>Donate</NavLink>
            <NavLink to="/calculatezakat" className="btn btn-primary" onClick={closeMenu}>Calculate Zakat</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
