import { useEffect, useId, useRef } from "react";

function Lightbox({ image, index, total, onClose, onPrev, onNext }) {
  const closeButtonRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);
  const titleId = useId();
  const captionId = useId();

  useEffect(() => {
    if (!image) {
      return undefined;
    }

    previouslyFocusedElementRef.current = document.activeElement;
    closeButtonRef.current?.focus();

    const originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowRight") {
        onNext();
      } else if (event.key === "ArrowLeft") {
        onPrev();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalBodyOverflow;
      previouslyFocusedElementRef.current?.focus?.();
    };
  }, [image, onClose, onNext, onPrev]);

  if (!image) {
    return null;
  }

  return (
    <div
      className="lightbox-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={captionId}
    >
      <div className="lightbox-content" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          ref={closeButtonRef}
          className="lightbox-close"
          onClick={onClose}
          aria-label="Close enlarged image"
        >
          <span aria-hidden="true">&times;</span>
        </button>

        <button
          type="button"
          className="lightbox-nav lightbox-prev"
          onClick={onPrev}
          aria-label="Previous image"
        >
          <span aria-hidden="true">&#8249;</span>
        </button>

        <figure className="lightbox-figure">
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="lightbox-image"
          />
          <figcaption>
            <p id={titleId} className="lightbox-title">
              {image.title}
            </p>
            <p id={captionId} className="lightbox-caption">
              <span className="lightbox-category">{image.categoryLabel ?? image.category}</span>
              {image.caption}
            </p>
            {total ? (
              <p className="lightbox-position">
                Image {index + 1} of {total}
              </p>
            ) : null}
          </figcaption>
        </figure>

        <button
          type="button"
          className="lightbox-nav lightbox-next"
          onClick={onNext}
          aria-label="Next image"
        >
          <span aria-hidden="true">&#8250;</span>
        </button>
      </div>
    </div>
  );
}

export default Lightbox;
