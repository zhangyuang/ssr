import { test, expect } from '@playwright/test';

test.describe('SSR (No Swiper)', () => {
  test('SSR mode should be render successful', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(10000);
    const useSSR = await page.evaluate(() => (window as any).__USE_SSR__);
    expect(useSSR).toBe(true);
  });

  test('SSR mode detail Page should be render successful', async ({ page }) => {
    await page.goto('http://localhost:3000/detail/cbba934b14f747049187');
    const useSSR = await page.evaluate(() => (window as any).__USE_SSR__);
    expect(useSSR).toBe(true);
  });

  test('CSR mode should be render successful', async ({ page }) => {
    await page.goto('http://localhost:3000?csr=true');
    const useSSR = await page.evaluate(() => (window as any).__USE_SSR__);
    expect(useSSR).not.toBe(true);
  });

  test('CSR mode detail Page should be render successful', async ({ page }) => {
    await page.goto('http://localhost:3000/detail/cbba934b14f747049187?csr=true');
    const useSSR = await page.evaluate(() => (window as any).__USE_SSR__);
    expect(useSSR).not.toBe(true);
  });
});