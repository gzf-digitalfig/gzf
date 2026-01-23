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

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;

        // Show if scrolling up or at top, hide if scrolling down and not at top
        if (currentScrollY < lastScrollY || currentScrollY < 50) {
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
          setIsVisible(false);
        }

        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);

    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  const closeMenu = () => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <nav className={`navbar ${!isVisible && !isMenuOpen ? 'nav-hidden' : ''}`}>
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
