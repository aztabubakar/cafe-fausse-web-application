import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import Hero from "../components/Hero.jsx";
import ResponsiveImage from "../components/ResponsiveImage.jsx";
import AwardCard from "../components/AwardCard.jsx";
import ReviewCard from "../components/ReviewCard.jsx";
import NewsletterForm from "../components/NewsletterForm.jsx";
import { IMAGES } from "../data/images.js";
import { menu } from "../data/menu.js";
import { awards } from "../data/awards.js";
import { reviews } from "../data/reviews.js";
import { contact } from "../data/contact.js";
import { commitments } from "../data/founders.js";

const introImage = IMAGES.restaurantDiningRoom;
const featuredDishNames = ["Bruschetta", "Ribeye Steak", "Tiramisu"];
const featuredDishes = menu
  .flatMap((section) => section.items)
  .filter((item) => featuredDishNames.includes(item.name) && item.image);

function Home() {
  useDocumentTitle("Café Fausse | Modern Italian Fine Dining in Washington, DC");

  return (
    <>
      <Hero
        image={IMAGES.heroRestaurantInterior}
        title="Café Fausse"
        tagline="Modern Italian fine dining in the heart of Washington, DC"
        actions={[
          { to: "/reservations", label: "Reserve a Table" },
          { to: "/menu", label: "View Menu" },
        ]}
      />

      <section className="section intro-section">
        <ResponsiveImage
          src={introImage.src}
          alt={introImage.alt}
          width={introImage.width}
          height={introImage.height}
          className="intro-image"
        />
        <div>
          <h2>Traditional Flavor, Modern Craft</h2>
          <p>
            Café Fausse blends traditional Italian flavors with modern culinary innovation.
            Since 2010, our kitchen has paired time-honored technique with a seasonal, modern
            point of view, creating a menu that feels both familiar and new.
          </p>
        </div>
      </section>

      <section className="section">
        <h2>From the Menu</h2>
        <ul className="featured-dish-grid">
          {featuredDishes.map((dish) => (
            <li key={dish.name} className="featured-dish-card">
              <ResponsiveImage
                src={dish.image.src}
                alt={dish.image.alt}
                width={dish.image.width}
                height={dish.image.height}
                className="featured-dish-image"
              />
              <p className="featured-dish-name">{dish.name}</p>
              <p className="featured-dish-price">{dish.price}</p>
            </li>
          ))}
        </ul>
        <Link className="button button-secondary" to="/menu">
          View Full Menu
        </Link>
      </section>

      <section className="section">
        <h2>The Café Fausse Experience</h2>
        <ul className="commitment-grid">
          {commitments.map((commitment) => (
            <li className="commitment-card" key={commitment.title}>
              <p className="commitment-title">{commitment.title}</p>
              <p className="commitment-description">{commitment.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2>Awards</h2>
        <ul className="award-grid">
          {awards.map((award) => (
            <AwardCard key={award.title} {...award} />
          ))}
        </ul>
      </section>

      <section className="section">
        <h2>What Guests Are Saying</h2>
        <ul className="review-grid">
          {reviews.map((review) => (
            <ReviewCard key={review.source} {...review} />
          ))}
        </ul>
      </section>

      <section className="section">
        <h2>Visit Us</h2>
        <address>
          <p>{contact.address}</p>
          <p>
            <a href={contact.phoneHref}>{contact.phone}</a>
          </p>
        </address>
        <dl className="hours-list">
          {contact.hours.map((entry) => (
            <div key={entry.days}>
              <dt>{entry.days}</dt>
              <dd>{entry.time}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="section">
        <h2>Stay in Touch</h2>
        <p>Sign up for our newsletter to hear about seasonal menus and special events.</p>
        <NewsletterForm />
      </section>
    </>
  );
}

export default Home;
