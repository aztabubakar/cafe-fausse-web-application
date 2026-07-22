import { useEffect, useId, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { NAV_LINKS } from "../data/navigation.js";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const menuId = useId();

  // Close the mobile menu on any route change, which covers both selecting
  // a nav link and the Reserve a Table button.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  return (
    <header>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="header-bar">
        <Link to="/" className="site-title">
          Café Fausse
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={isMenuOpen}
          aria-controls={menuId}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="nav-toggle-icon" aria-hidden="true" />
        </button>

        <nav aria-label="Primary" id={menuId} className={isMenuOpen ? "primary-nav nav-open" : "primary-nav"}>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) => (isActive ? "active" : undefined)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link to="/reservations" className="button button-primary nav-cta">
            Reserve a Table
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
