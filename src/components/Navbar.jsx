import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/logo.webp";
import "../App.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav>
      <div className="nav-container">
        <div className="nav-brand">
          <NavLink to="/" onClick={closeMenu}>
            <img 
              src={logo} 
              alt="Gloucester Zakat Fund Logo"
              style={{ height: 96, marginRight: 24, verticalAlign: 'middle' }}
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
          <NavLink to="/whatiszakat" onClick={closeMenu}>What is Zakat</NavLink>
          <NavLink to="/apply" onClick={closeMenu}>Apply</NavLink>
          <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
          <NavLink to="/calculatezakat" className="btn btn-primary" onClick={closeMenu}>Calculate Zakat</NavLink>
        </div>
      </div>
    </nav>
  );
}
