import { test, expect } from "@playwright/test";

test("home shows brand and project listing", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".banner h1")).toContainText("Frank Schlesinger");
  await expect(page.locator("#projects-body .name").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "production" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "staging" }).first()).toBeVisible();
  await expect(page.locator("#visitor-counter")).toHaveText(/\d{6}/);
});

test("imprint page loads", async ({ page }) => {
  await page.goto("/imprint.html");
  await expect(page.locator(".banner h1")).toContainText("Imprint");
  await expect(page.getByRole("link", { name: /Back to homepage/i })).toBeVisible();
});
