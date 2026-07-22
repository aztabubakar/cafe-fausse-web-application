import { useState } from "react";
import Lightbox from "./Lightbox.jsx";

function GalleryGrid({ images }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const openAt = (index) => setActiveIndex(index);
  const close = () => setActiveIndex(null);
  const showPrev = () => setActiveIndex((current) => (current - 1 + images.length) % images.length);
  const showNext = () => setActiveIndex((current) => (current + 1) % images.length);

  const activeImage = activeIndex === null ? null : images[activeIndex];

  return (
    <>
      <ul className="gallery-grid">
        {images.map((image, index) => (
          <li key={image.id} className="gallery-item">
            <button
              type="button"
              className="gallery-thumb"
              onClick={() => openAt(index)}
              aria-label={`View enlarged image: ${image.title}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                loading="lazy"
                decoding="async"
              />
            </button>
            <div className="gallery-item-caption">
              <p className="gallery-item-title">{image.title}</p>
              <p className="gallery-item-category">{image.categoryLabel}</p>
            </div>
          </li>
        ))}
      </ul>
      <Lightbox
        image={activeImage}
        index={activeIndex ?? 0}
        total={images.length}
        onClose={close}
        onPrev={showPrev}
        onNext={showNext}
      />
    </>
  );
}

export default GalleryGrid;
