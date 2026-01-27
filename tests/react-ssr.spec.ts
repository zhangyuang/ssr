import { test, expect } from "@playwright/test";

test.describe("React SSR", () => {
  test("Context can be shared between different component", async ({ page }) => {
    // context 状态能够被各个组件共享
    const text = "Hello, World";
    await page.goto("http://localhost:3000");
    await page.locator("input").fill(text);
    await page.locator(".swiper-slide-active").first().click();
    await expect(page.locator("input")).toHaveValue(text);
    await page.locator("input").fill(text + "new");
    await page.goBack();
    await expect(page.locator("input")).toHaveValue(text + "new");
  });
});
