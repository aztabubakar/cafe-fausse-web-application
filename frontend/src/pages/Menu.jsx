import ResponsiveImage from "../components/ResponsiveImage.jsx";
import { menu } from "../data/menu.js";

function Menu() {
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
                    src={item.image}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
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
    </section>
  );
}

export default Menu;
