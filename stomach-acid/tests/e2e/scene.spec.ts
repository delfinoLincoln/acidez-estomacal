import { test, expect } from "@playwright/test";

test("tema persiste, mantém a reação e câmera responde", async ({ page }) => {
  await page.goto("/#livre");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("canvas")).toBeVisible();
  await expect(page.locator(".scene-fallback")).toHaveCount(0);
  await page.getByRole("button", { name: "Pausar animação" }).click();
  const canvas = page.locator("canvas");
  const before = await canvas.screenshot();
  await page.getByRole("button", { name: "Girar", exact: true }).click();
  await expect.poll(async () => (await canvas.screenshot()).equals(before)).toBe(false);
  await page.getByRole("button", { name: "Restaurar vista" }).click();
  await page.getByRole("button", { name: "Só partículas" }).click();
  await expect(page.getByRole("button", { name: "Só partículas" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "+ Adicionar antiácido" }).click();
  await page.getByRole("button", { name: "Ativar tema claro" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator(".stats")).toContainText("HCl restante10 mmol");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Ativar tema escuro" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("sem WebGL o experimento continua utilizável", async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (type.includes("webgl")) return null;
      return getContext.apply(this, [type, ...args] as never);
    } as typeof getContext;
  });
  await page.goto("/#livre");
  await expect(page.locator(".scene-fallback")).toBeVisible();
  await page.getByRole("button", { name: "+ Adicionar antiácido" }).click();
  await expect(page.locator(".stats")).toContainText("HCl restante10 mmol");
});

test("os dois temas cabem em celular e a cena respeita movimento reduzido", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#livre");
  await expect(page.locator("canvas")).toBeVisible();
  for (const theme of ["dark", "light"]) {
    if (theme === "light") await page.getByRole("button", { name: "Ativar tema claro" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const before = await page.locator("canvas").screenshot();
    await page.waitForTimeout(250);
    expect((await page.locator("canvas").screenshot()).equals(before)).toBe(true);
  }
});
