import { test, expect } from '@playwright/test';
import { gotoHydrated } from './support/hydration';

test.describe('Theme', () => {
  test('follows the operating system by default', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await gotoHydrated(page, '/');

    // No explicit choice means no attribute — the CSS media query decides.
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.*/);
  });

  test('toggles to dark and back', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await gotoHydrated(page, '/');

    const toggle = page.getByRole('button', { name: 'Switch to dark theme' });
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.getByRole('button', { name: 'Switch to light theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('reports its state through aria-pressed', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await gotoHydrated(page, '/');

    const toggle = page.getByRole('button', { name: /Switch to .* theme/ });
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await toggle.click();
    await expect(
      page.getByRole('button', { name: /Switch to .* theme/ })
    ).toHaveAttribute('aria-pressed', 'true');
  });

  test('remembers the choice across a reload without flashing', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await gotoHydrated(page, '/');

    await page.getByRole('button', { name: 'Switch to dark theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.reload();

    // Set by the inline pre-paint script, so it is already correct before
    // Angular boots — no flash of the wrong theme.
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('applies the dark palette to the page background', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await gotoHydrated(page, '/services');

    const lightBg = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor
    );

    await page.getByRole('button', { name: 'Switch to dark theme' }).click();

    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
      .not.toBe(lightBg);
  });
});
