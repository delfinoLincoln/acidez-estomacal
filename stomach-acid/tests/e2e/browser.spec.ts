import { test, expect } from "@playwright/test";

test("introdução, três missões, pontuação e reinício", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Acidez");
  await page.getByRole("link", { name: "Começar o minigame" }).click();
  for (const count of [3, 4, 4]) {
    await expect(
      page.getByRole("button", { name: "+ Adicionar antiácido" }),
    ).toBeDisabled();
    await page
      .getByRole("button", { name: `${count} adições`, exact: true })
      .click();
    for (let i = 0; i < count; i++)
      await page.getByRole("button", { name: "+ Adicionar antiácido" }).click();
    await page.getByRole("button", { name: "Conferir minha reação" }).click();
    await expect(
      page.getByRole("button", { name: "Conferir minha reação" }),
    ).toBeDisabled();
    await page
      .getByRole("button", { name: /Próxima missão|Ver resultado final/ })
      .click();
  }
  await expect(page.locator(".result-score")).toHaveText("450 / 450 pontos");
  await page.getByRole("button", { name: "Jogar novamente" }).click();
  await expect(page.locator(".score strong")).toHaveText("0 / 450");
  expect(errors).toEqual([]);
});

test("erro de previsão, ultrapassar a meta e recuperar tentativa", async ({
  page,
}) => {
  await page.goto("/#jogo");
  await page.getByRole("button", { name: "2 adições", exact: true }).click();
  await expect(page.locator(".prediction")).toContainText("São 3 adições");
  for (let i = 0; i < 4; i++)
    await page.getByRole("button", { name: "+ Adicionar antiácido" }).click();
  await page.getByRole("button", { name: "Conferir minha reação" }).click();
  await expect(page.locator(".mission-feedback")).toContainText(
    "passou da meta",
  );
  await page.getByRole("button", { name: "Reiniciar tentativa" }).click();
  await expect(
    page.getByRole("button", { name: "3 adições", exact: true }),
  ).toBeDisabled();
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: "+ Adicionar antiácido" }).click();
  await page.getByRole("button", { name: "Conferir minha reação" }).click();
  await expect(page.locator(".score strong")).toHaveText("100 / 450");
});

test("modo livre, troca de substância e ácido esgotado", async ({ page }) => {
  await page.goto("/#livre");
  await page.getByLabel("Componente do antiácido").selectOption("sodium");
  for (let i = 0; i < 12; i++)
    await page.getByRole("button", { name: "+ Adicionar antiácido" }).click();
  await expect(
    page.getByRole("button", { name: "HCl inicial consumido" }),
  ).toBeDisabled();
  await expect(page.locator(".stats")).toContainText("CO₂ formado12 mmol");
  await page.getByLabel("Componente do antiácido").selectOption("calcium");
  await expect(page.locator(".stats")).toContainText("HCl restante12 mmol");
  await expect(page.locator(".dose-count")).toContainText("0 adições");
  await page.getByRole("button", { name: "Pausar animação" }).click();
  await expect(
    page.getByRole("button", { name: "Retomar animação" }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("layout em celular e movimento reduzido", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of ["/", "/#jogo", "/#livre"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator(".molecular-view")).toBeVisible();
  }
});
