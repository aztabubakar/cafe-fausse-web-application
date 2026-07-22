import { Link } from "react-router-dom";
import ResponsiveImage from "./ResponsiveImage.jsx";

function Hero({ image, title, tagline, ctaTo, ctaLabel }) {
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
        {ctaTo ? (
          <Link className="button button-primary" to={ctaTo}>
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}

export default Hero;
