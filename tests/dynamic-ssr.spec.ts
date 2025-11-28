import { test, expect } from '@playwright/test';

test.describe('React SSR dynamic router', () => {
  test('dynamic router will only match one route', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
  });

  test('zh page can be render succeed', async ({ page }) => {
    await page.goto('http://localhost:3000/zh');
  });

  test('en page can be render succeed', async ({ page }) => {
    await page.goto('http://localhost:3000/en');
  });
});