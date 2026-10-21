import { useId, useRef, useState } from "react";
import "./TestimonialCarousel.css";

export default function TestimonialCarousel({ testimonials }) {
  const viewportRef = useRef(null);
  const viewportId = useId();
  const [activeIndex, setActiveIndex] = useState(0);

  if (testimonials.length === 0) return null;

  const goToSlide = (index) => {
    const viewport = viewportRef.current;
    const nextIndex = (index + testimonials.length) % testimonials.length;
    viewport.scrollTo({
      left: nextIndex * viewport.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };

  const handleKeyDown = (event) => {
    let nextIndex;
    switch (event.key) {
      case "ArrowLeft": nextIndex = activeIndex - 1; break;
      case "ArrowRight": nextIndex = activeIndex + 1; break;
      case "Home": nextIndex = 0; break;
      case "End": nextIndex = testimonials.length - 1; break;
      default: return;
    }
    event.preventDefault();
    goToSlide(nextIndex);
  };

  return (
    <div
      className="testimonials-carousel"
      role="group"
      aria-roledescription="carousel"
      aria-label="Recipient testimonials"
      onKeyDown={handleKeyDown}
    >
      <div
        className="testimonial-carousel-viewport"
        id={viewportId}
        ref={viewportRef}
        tabIndex={0}
        aria-label="Testimonials; use the left and right arrow keys to browse"
        onScroll={(event) => {
          const viewport = event.currentTarget;
          setActiveIndex(Math.round(viewport.scrollLeft / viewport.clientWidth));
        }}
      >
        {testimonials.map((testimonial, index) => (
          <div
            className="testimonial-carousel-slide"
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${testimonials.length}`}
            aria-hidden={index !== activeIndex}
          >
            <figure className="card testimonial-card">
              <blockquote><p>“{testimonial.quote}”</p></blockquote>
              <figcaption>{testimonial.author}</figcaption>
            </figure>
          </div>
        ))}
      </div>
      {testimonials.length > 1 && (
        <div className="testimonial-carousel-controls">
          <button
            className="testimonial-carousel-button testimonial-carousel-arrow"
            type="button"
            aria-label="Previous testimonial"
            aria-controls={viewportId}
            onClick={() => goToSlide(activeIndex - 1)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <div className="testimonial-carousel-indicators" aria-label="Choose a testimonial">
            {testimonials.map((_, index) => (
              <button
                className="testimonial-carousel-button testimonial-carousel-dot"
                type="button"
                key={index}
                aria-label={`Show testimonial ${index + 1}`}
                aria-controls={viewportId}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => goToSlide(index)}
              >
                <span aria-hidden="true" />
              </button>
            ))}
          </div>
          <button
            className="testimonial-carousel-button testimonial-carousel-arrow"
            type="button"
            aria-label="Next testimonial"
            aria-controls={viewportId}
            onClick={() => goToSlide(activeIndex + 1)}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
      <p className="testimonial-carousel-status" role="status" aria-atomic="true">
        Testimonial {activeIndex + 1} of {testimonials.length}
      </p>
    </div>
  );
}
