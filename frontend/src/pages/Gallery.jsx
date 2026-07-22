import GalleryGrid from "../components/GalleryGrid.jsx";
import AwardCard from "../components/AwardCard.jsx";
import ReviewCard from "../components/ReviewCard.jsx";
import { galleryManifest, GALLERY_CATEGORIES } from "../data/galleryManifest.js";
import { awards, reviews } from "../data/awardsReviews.js";

const CATEGORY_ORDER = [
  GALLERY_CATEGORIES.INTERIOR,
  GALLERY_CATEGORIES.DISHES,
  GALLERY_CATEGORIES.EVENTS,
  GALLERY_CATEGORIES.BEHIND_THE_SCENES,
  GALLERY_CATEGORIES.STORY,
];

function Gallery() {
  return (
    <section className="section">
      <h1>Gallery</h1>
      <p>
        A look at Café Fausse&mdash;our dining room, dishes from the menu, special
        events, behind-the-scenes moments, and the founders behind it all. Select any
        image for an enlarged view.
      </p>

      {CATEGORY_ORDER.map((category) => {
        const images = galleryManifest.filter((image) => image.category === category);
        if (images.length === 0) {
          return null;
        }
        return (
          <div className="gallery-category" key={category}>
            <h2>{category}</h2>
            <GalleryGrid images={images} />
          </div>
        );
      })}

      <div className="gallery-category">
        <h2>Awards</h2>
        <ul className="award-grid">
          {awards.map((award) => (
            <AwardCard key={award.title} {...award} />
          ))}
        </ul>
      </div>

      <div className="gallery-category">
        <h2>Reviews</h2>
        <ul className="review-grid">
          {reviews.map((review) => (
            <ReviewCard key={review.source} {...review} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Gallery;
