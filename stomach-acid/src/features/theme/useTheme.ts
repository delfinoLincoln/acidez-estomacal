import { useEffect, useState } from "react";
type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return localStorage.getItem("acidez-theme") === "light"
        ? "light"
        : "dark";
    } catch {
      return "dark";
    }
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#080f1b" : "#eef3f9");
    try {
      localStorage.setItem("acidez-theme", theme);
    } catch {
      /* O tema funciona mesmo sem armazenamento. */
    }
  }, [theme]);
  return { theme, setTheme };
}
