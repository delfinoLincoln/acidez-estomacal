import { Children, useId, useRef, useState, type ReactNode } from "react";
import "./Carousel.css";

export default function Carousel({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  const slides = Children.toArray(children);
  const [index, setIndex] = useState(0);
  const start = useRef<{ x: number; y: number } | null>(null);
  const id = useId();
  const move = (next: number) =>
    setIndex(Math.max(0, Math.min(slides.length - 1, next)));
  return (
    <section
      className="carousel"
      aria-label={label}
      aria-roledescription="carrossel"
    >
      <div
        className="carousel-stage"
        id={id}
        tabIndex={0}
        aria-label="Use as setas esquerda e direita para trocar de card"
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
            e.preventDefault();
            move(
              e.key === "Home"
                ? 0
                : e.key === "End"
                  ? slides.length - 1
                  : index + (e.key === "ArrowRight" ? 1 : -1),
            );
          }
        }}
        onTouchStart={(e) => {
          start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }}
        onTouchEnd={(e) => {
          if (!start.current) return;
          const dx = e.changedTouches[0].clientX - start.current.x;
          const dy = e.changedTouches[0].clientY - start.current.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy))
            move(index + (dx < 0 ? 1 : -1));
          start.current = null;
        }}
        onTouchCancel={() => {
          start.current = null;
        }}
      >
        <div
          key={index}
          className="carousel-slide"
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} de ${slides.length}`}
        >
          {slides[index]}
        </div>
      </div>
      <div className="carousel-controls">
        <span className="carousel-count" aria-live="polite" aria-atomic="true">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(slides.length).padStart(2, "0")}
        </span>
        <div className="carousel-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Ir para card ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => move(i)}
            >
              <span />
            </button>
          ))}
        </div>
        <div className="carousel-arrows">
          <button
            aria-label="Card anterior"
            aria-controls={id}
            disabled={index === 0}
            onClick={() => move(index - 1)}
          >
            ←
          </button>
          <button
            aria-label="Próximo card"
            aria-controls={id}
            disabled={index === slides.length - 1}
            onClick={() => move(index + 1)}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
