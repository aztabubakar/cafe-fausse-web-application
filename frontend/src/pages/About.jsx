import ResponsiveImage from "../components/ResponsiveImage.jsx";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { IMAGES } from "../data/images.js";
import { history, founders, commitments } from "../data/founders.js";

const kitchenTeamImage = IMAGES.kitchenTeam;

function About() {
  useDocumentTitle("About Us | Café Fausse");

  return (
    <section className="section">
      <h1>About Us</h1>
      <p className="about-history">{history}</p>

      <h2>Our Founders</h2>
      <ul className="founder-grid">
        {founders.map((founder) => (
          <li className="founder-card" key={founder.name}>
            <ResponsiveImage
              src={founder.image.src}
              alt={founder.image.alt}
              width={founder.image.width}
              height={founder.image.height}
              className="founder-image"
            />
            <p className="founder-name">{founder.name}</p>
            <p className="founder-role">{founder.role}</p>
            <p className="founder-bio">{founder.bio}</p>
          </li>
        ))}
      </ul>

      <h2>Our Commitments</h2>
      <ul className="commitment-grid">
        {commitments.map((commitment) => (
          <li className="commitment-card" key={commitment.title}>
            <p className="commitment-title">{commitment.title}</p>
            <p className="commitment-description">{commitment.description}</p>
          </li>
        ))}
      </ul>

      <figure className="about-figure">
        <ResponsiveImage
          src={kitchenTeamImage.src}
          alt={kitchenTeamImage.alt}
          width={kitchenTeamImage.width}
          height={kitchenTeamImage.height}
          className="about-figure-image"
        />
        <figcaption>{kitchenTeamImage.caption}</figcaption>
      </figure>
    </section>
  );
}

export default About;
