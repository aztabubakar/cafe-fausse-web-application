import { Link } from "react-router-dom";
import ResponsiveImage from "../components/ResponsiveImage.jsx";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { menu } from "../data/menu.js";

function Menu() {
  useDocumentTitle("Menu | Café Fausse");

  return (
    <section className="section">
      <h1>Menu</h1>
      {menu.map((section) => (
        <div className="menu-section" key={section.category}>
          <h2>{section.category}</h2>
          <ul className="menu-item-grid">
            {section.items.map((item) => (
              <li className="menu-item-card" key={item.name}>
                {item.image ? (
                  <ResponsiveImage
                    src={item.image.src}
                    alt={item.image.alt}
                    width={item.image.width}
                    height={item.image.height}
                    className="menu-item-image"
                  />
                ) : null}
                <div className="menu-item-details">
                  <div className="menu-item-heading">
                    <p className="menu-item-name">{item.name}</p>
                    <p className="menu-item-price">{item.price}</p>
                  </div>
                  <p className="menu-item-description">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="menu-cta">
        <h2>Ready to Dine With Us?</h2>
        <p>Reserve your table and enjoy the full Café Fausse menu in person.</p>
        <Link className="button button-primary" to="/reservations">
          Reserve a Table
        </Link>
      </div>
    </section>
  );
}

export default Menu;
