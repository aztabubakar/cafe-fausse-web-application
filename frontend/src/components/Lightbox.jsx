import { useEffect, useRef } from "react";

function Lightbox({ image, onClose, onPrev, onNext }) {
  const closeButtonRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);

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
      aria-label={`${image.caption}, enlarged view`}
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
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="lightbox-image"
        />
        <p className="lightbox-caption">
          <span className="lightbox-category">{image.category}</span>
          {image.caption}
        </p>
      </div>
    </div>
  );
}

export default Lightbox;
