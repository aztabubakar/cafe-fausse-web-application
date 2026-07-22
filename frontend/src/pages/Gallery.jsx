import { useMemo, useState } from "react";
import GalleryFilters from "../components/GalleryFilters.jsx";
import GalleryGrid from "../components/GalleryGrid.jsx";
import AwardCard from "../components/AwardCard.jsx";
import ReviewCard from "../components/ReviewCard.jsx";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { galleryImages, GALLERY_FILTERS } from "../data/images.js";
import { awards } from "../data/awards.js";
import { reviews } from "../data/reviews.js";

function Gallery() {
  useDocumentTitle("Gallery | Café Fausse");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredImages = useMemo(
    () =>
      activeFilter === "all"
        ? galleryImages
        : galleryImages.filter((image) => image.galleryCategory === activeFilter),
    [activeFilter],
  );

  return (
    <section className="section">
      <h1>Gallery</h1>
      <p>
        A look at Café Fausse&mdash;our dining room, dishes from the menu, special events,
        and behind-the-scenes moments. Select any image for an enlarged view.
      </p>

      <GalleryFilters filters={GALLERY_FILTERS} activeFilter={activeFilter} onChange={setActiveFilter} />
      <GalleryGrid key={activeFilter} images={filteredImages} />

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
