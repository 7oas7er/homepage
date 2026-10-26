import { test, expect } from "@playwright/test";

test("home shows brand and project listing", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".banner h1")).toHaveText("Frank Schlesinger");
  await expect(page.locator("#projects-body .name").first()).toBeVisible();
  const prod = page.getByRole("link", { name: "production" }).first();
  const stg = page.getByRole("link", { name: "staging" }).first();
  await expect(prod).toBeVisible();
  await expect(stg).toBeVisible();
  await expect(prod).toHaveAttribute("target", "_blank");
  await expect(prod).toHaveAttribute("rel", "noopener noreferrer");
  await expect(stg).toHaveAttribute("target", "_blank");
  await expect(stg).toHaveAttribute("rel", "noopener noreferrer");
  await expect(page.locator("#visitor-counter")).toHaveText(/\d{6}/);
});

test("imprint page loads", async ({ page }) => {
  await page.goto("/imprint.html");
  await expect(page.locator(".banner h1")).toContainText("Imprint");
  await expect(page.getByRole("link", { name: /Back to homepage/i })).toBeVisible();
});
