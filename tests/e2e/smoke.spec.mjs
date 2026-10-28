import { test, expect } from "@playwright/test";

test("home shows brand and project listing", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("Frank Schlesinger");
  await expect(page.locator("#projects h2").first()).toBeVisible();
  await expect(page.locator("#projects p").first()).toBeVisible();
  const prod = page.getByRole("link", { name: "production" }).first();
  const stg = page.getByRole("link", { name: "staging" }).first();
  const repo = page.getByRole("link", { name: "repository" }).first();
  await expect(prod).toBeVisible();
  await expect(stg).toBeVisible();
  await expect(repo).toBeVisible();
  await expect(prod).toHaveAttribute("target", "_blank");
  await expect(prod).toHaveAttribute("rel", "noopener noreferrer");
  await expect(stg).toHaveAttribute("target", "_blank");
  await expect(stg).toHaveAttribute("rel", "noopener noreferrer");
  await expect(repo).toHaveAttribute("target", "_blank");
  await expect(repo).toHaveAttribute("rel", "noopener noreferrer");
  await expect(page.locator("#visitor-counter")).toHaveText(/\d{6}/);
  // No external stylesheet — HTML 3.2 attribute styling only
  await expect(page.locator('link[rel="stylesheet"]')).toHaveCount(0);
  // Single layout table constrains content to ~80% viewport width
  await expect(page.locator('table[width="80%"]')).toHaveCount(1);
});

test("imprint page loads", async ({ page }) => {
  await page.goto("/imprint.html");
  await expect(page.locator("h1")).toHaveText("Imprint");
  await expect(page.getByRole("link", { name: /Back to homepage/i })).toBeVisible();
  await expect(page.locator('link[rel="stylesheet"]')).toHaveCount(0);
});
