import { test, expect } from "@playwright/test";

test("capítulos, carrossel por teclado e menu com Escape", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("link", { name: /Conceitos/ }).click();
  await expect(page.getByRole("navigation")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "O estômago é ácido." })).toBeVisible();
  await page.getByRole("button", { name: "Próximo card" }).click();
  await expect(page.getByRole("heading", { name: "De onde vem a azia?" })).toBeVisible();
  await page.locator(".carousel-stage").focus();
  await page.keyboard.press("End");
  await expect(page.getByRole("heading", { name: "O antiácido reage." })).toBeVisible();
  await expect(page.getByRole("button", { name: "Próximo card" })).toBeDisabled();
  await page.keyboard.press("Home");
  await expect(page.getByRole("heading", { name: "O estômago é ácido." })).toBeVisible();
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Menu", exact: true })).toBeFocused();
  await page.getByRole("link", { name: /Próximo capítulo/ }).click();
  await expect(page).toHaveURL(/#reacoes$/);
  await page.goBack();
  await expect(page).toHaveURL(/#conceitos$/);
});

test("capítulos em celular, toque e temas", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const chapter of ["conceitos", "reacoes", "apresentacao"]) {
    await page.goto("/#" + chapter);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    for (const theme of ["dark", "light"]) {
      await page.evaluate(t => document.documentElement.dataset.theme = t, theme);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
  await page.goto("/#conceitos");
  const stage = page.locator(".carousel-stage");
  await stage.evaluate(el => {
    const touch = (x: number) => new Touch({ identifier: 1, target: el, clientX: x, clientY: 350 });
    el.dispatchEvent(new TouchEvent("touchstart", { bubbles: true, touches: [touch(300)] }));
    el.dispatchEvent(new TouchEvent("touchend", { bubbles: true, changedTouches: [touch(100)] }));
  });
  await expect(page.getByRole("heading", { name: "De onde vem a azia?" })).toBeVisible();
  await page.screenshot({ path: "test-results/carousel-mobile.png", fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.screenshot({ path: "test-results/cover-desktop.png", fullPage: true });
});
