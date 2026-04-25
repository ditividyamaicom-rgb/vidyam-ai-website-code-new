import { React, useState, useEffect } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";


const navLinks = [
  { label: "About Us", href: "#about" },
  { label: "Team", href: "#team" },
  { label: "Career", href: "#career" },
  { label: "Contact Us", href: "#contact" },
];

const NavbarComp = () => {
  const email = localStorage.getItem("email");
  const [opacity, setOpacity] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Reduce opacity as user scrolls down
      // At scroll position 0, opacity is 1 (fully visible)
      // At scroll position 100, opacity is 0.7 (reduced)
      const newOpacity = Math.max(0.7, 1 - scrollPosition / 300);
      setOpacity(newOpacity);
    };

    window.addEventListener("scroll", handleScroll);
    // Set initial opacity
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const removeDataFromLocalStorage = () => {
    // Remove the data from local storage

    localStorage.removeItem("email");
    navigate("/");
    window.location.reload();

    // Update the state if needed
    // setData(null);

    // Optionally, you can perform additional actions after removing the data
    // console.log('Data removed from local storage.');
    // navigate(0)
  };

  // Handle smooth scroll for anchor links
  const handleNavLinkClick = (e, href) => {
    // Only handle anchor links (starting with #)
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="home-header" style={{ opacity: opacity }}>
      <header
        data-thq="thq-navbar"
        className="navbarContainer home-navbar-interactive"
      >
        {/* Mobile bar */}
        <div className="home-mobile-bar">
          <button
            className="hamburger-btn"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <Link to="/" style={{ textDecoration: "none" }} onClick={() => setMobileMenuOpen(false)}>
            <img
              src="/images/textonly_logo.png"
              alt="Vidyam AI"
              className="navbar-logo-image mobile-logo"
            />
          </Link>
          <div className="home-mobile-actions">
            {email === "team@vidyamai.com" ? (
              <Link to="/magic" onClick={() => setMobileMenuOpen(false)}>
                <CgProfile className="profileIcon" />
              </Link>
            ) : email === "sales@vidyamai.com" ? (
              <Link to="/sales-magic-chat" onClick={() => setMobileMenuOpen(false)}>
                <CgProfile className="profileIcon" />
              </Link>
            ) : null}
            {email ? (
              <button
                className="navbar-cta mobile-cta"
                onClick={() => {
                  setMobileMenuOpen(false);
                  removeDataFromLocalStorage();
                }}
              >
                Log Out
              </button>
            ) : (
              <Link
                to="/login"
                className="navbar-cta mobile-cta"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login/Sign Up
              </Link>
            )}
          </div>
        </div>
        {mobileMenuOpen && (
          <nav className="mobile-menu">
            {navLinks.map((item) => (
              <a
                key={item.label}
                className="navbar-link mobile-link"
                href={item.href}
                onClick={(e) => {
                  handleNavLinkClick(e, item.href);
                  setMobileMenuOpen(false);
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        {/* Desktop layout */}
        <Link to="/" style={{ textDecoration: "none" }} className="desktop-logo">
          <img 
            src="/images/textonly_logo.png" 
            alt="Vidyam AI" 
            className="navbar-logo-image"
          />
        </Link>
        <div data-thq="thq-navbar-nav" className="home-desktop-menu">
          <nav className="navbar-links">
            {navLinks.map((item) => (
              <a 
                key={item.label} 
                className="navbar-link" 
                href={item.href}
                onClick={(e) => handleNavLinkClick(e, item.href)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="home-buttons">
            {email === "team@vidyamai.com" ? (
              <Link to="/magic">
                <CgProfile className="profileIcon" />
              </Link>
            ) : email === "sales@vidyamai.com" ? (
              <Link to="/sales-magic-chat">
                <CgProfile className="profileIcon" />
              </Link>
            ) : null}
            {email ? (
              <button
                className="navbar-cta"
                onClick={removeDataFromLocalStorage}
              >
                Log Out
              </button>
            ) : (
              <Link to="/login" className="navbar-cta">
                Login/Sign Up
              </Link>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default NavbarComp;
