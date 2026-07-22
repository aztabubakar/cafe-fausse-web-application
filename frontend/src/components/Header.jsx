import { NavLink } from "react-router-dom";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/reservations", label: "Reservations" },
  { to: "/about", label: "About Us" },
  { to: "/gallery", label: "Gallery" },
];

function Header() {
  return (
    <header>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <p className="site-title">Café Fausse</p>
      <nav aria-label="Primary">
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
      </nav>
    </header>
  );
}

export default Header;
