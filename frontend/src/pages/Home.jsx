import { Link } from "react-router-dom";
import Hero from "../components/Hero.jsx";
import ResponsiveImage from "../components/ResponsiveImage.jsx";
import AwardCard from "../components/AwardCard.jsx";
import ReviewCard from "../components/ReviewCard.jsx";
import { galleryManifest } from "../data/galleryManifest.js";
import { menu } from "../data/menu.js";
import { awards, reviews } from "../data/awardsReviews.js";

const heroImage = galleryManifest.find((image) => image.id === "hero-restaurant-interior");
const featuredDishNames = ["Bruschetta", "Ribeye Steak", "Tiramisu"];
const featuredDishes = menu
  .flatMap((section) => section.items)
  .filter((item) => featuredDishNames.includes(item.name) && item.image);

function Home() {
  return (
    <>
      <Hero
        image={heroImage}
        title="Café Fausse"
        tagline="Modern Italian fine dining in the heart of Washington, DC"
        ctaTo="/reservations"
        ctaLabel="Reserve a Table"
      />

      <section className="section">
        <h2>Welcome</h2>
        <p>
          Since 2010, Café Fausse has blended traditional Italian flavors with modern
          culinary innovation, offering a dining experience built on quality, creativity,
          and warm hospitality.
        </p>
      </section>

      <section className="section">
        <h2>Visit Us</h2>
        <address>
          <p>1234 Culinary Ave, Suite 100, Washington, DC 20002</p>
          <p>
            <a href="tel:+12025554567">(202) 555-4567</a>
          </p>
        </address>
        <dl className="hours-list">
          <div>
            <dt>Monday&ndash;Saturday</dt>
            <dd>5:00 PM&ndash;11:00 PM</dd>
          </div>
          <div>
            <dt>Sunday</dt>
            <dd>5:00 PM&ndash;9:00 PM</dd>
          </div>
        </dl>
      </section>

      <section className="section">
        <h2>From the Menu</h2>
        <ul className="featured-dish-grid">
          {featuredDishes.map((dish) => (
            <li key={dish.name} className="featured-dish-card">
              <ResponsiveImage
                src={dish.image}
                alt={dish.alt}
                width={dish.width}
                height={dish.height}
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
        <h2>Awards &amp; Reviews</h2>
        <ul className="award-grid">
          {awards.map((award) => (
            <AwardCard key={award.title} {...award} />
          ))}
        </ul>
        <ul className="review-grid">
          {reviews.map((review) => (
            <ReviewCard key={review.source} {...review} />
          ))}
        </ul>
      </section>
    </>
  );
}

export default Home;
