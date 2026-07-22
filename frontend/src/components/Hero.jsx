import { Link } from "react-router-dom";
import ResponsiveImage from "./ResponsiveImage.jsx";

function Hero({ image, title, tagline, actions = [] }) {
  return (
    <section className="hero">
      <ResponsiveImage
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        priority
        className="hero-image"
      />
      <div className="hero-overlay">
        <h1>{title}</h1>
        <p>{tagline}</p>
        {actions.length > 0 ? (
          <div className="hero-actions">
            {actions.map((action, index) => (
              <Link
                key={action.to}
                className={index === 0 ? "button button-primary" : "button button-secondary"}
                to={action.to}
              >
                {action.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default Hero;
