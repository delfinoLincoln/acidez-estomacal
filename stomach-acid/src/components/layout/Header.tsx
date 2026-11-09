import { useEffect, useRef, useState } from "react";
import ThemeToggle from "../../features/theme/ThemeToggle";
import type { Page } from "../../app/useHashNavigation";
import "./Header.css";

const chapters: { id: Page; label: string; detail: string }[] = [
  { id: "inicio", label: "início", detail: "O começo da investigação" },
  {
    id: "conceitos",
    label: "Conceitos",
    detail: "Ácido, digestão e antiácidos",
  },
  { id: "reacoes", label: "Reações", detail: "Compare as substâncias" },
  { id: "jogo", label: "Minigame", detail: "Três missões no laboratório" },
  { id: "livre", label: "Modo livre", detail: "Experimente no seu ritmo" },
];
export default function Header({ page }: { page: Page }) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    const outside = (e: PointerEvent) => {
      if (!container.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  return (
    <header className="site-header">
      <a className="brand" href="#inicio">
        a<span>e</span> / laboratório de química
      </a>
      <div className="header-actions">
        <span className="current-chapter">
          {chapters.find((c) => c.id === page)?.label}
        </span>
        <div className="menu-container" ref={container}>
          <button
            className="menu-trigger"
            ref={trigger}
            aria-expanded={open}
            aria-controls="chapter-menu"
            onClick={() => setOpen(!open)}
          >
            <span aria-hidden="true">{open ? "×" : "☰"}</span> Menu
          </button>
          {open && (
            <nav
              id="chapter-menu"
              className="chapter-menu"
              aria-label="Navegação principal"
            >
              <p className="eyebrow">EXPLORE O EXPERIMENTO</p>
              {chapters.map((chapter, i) => (
                <a
                  key={chapter.id}
                  href={`#${chapter.id}`}
                  aria-current={page === chapter.id ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span className="chapter-number">0{i + 1}</span>
                  <span>
                    <strong>{chapter.label}</strong>
                    <small>{chapter.detail}</small>
                  </span>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </nav>
          )}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
