import { useEffect, useRef, useState } from "react";

export type Page =
  | "inicio"
  | "conceitos"
  | "reacoes"
  | "apresentacao"
  | "jogo"
  | "livre";
const pages: Page[] = [
  "inicio",
  "conceitos",
  "reacoes",
  "apresentacao",
  "jogo",
  "livre",
];
const fromHash = (): Page | undefined =>
  pages.find((page) => window.location.hash === `#${page}`);

export function useHashNavigation() {
  const [page, setPage] = useState<Page>(() => fromHash() ?? "inicio");
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === "#conteudo") {
        mainRef.current?.focus();
        return;
      }
      setPage(fromHash() ?? "inicio");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [page]);
  return { page, mainRef };
}
