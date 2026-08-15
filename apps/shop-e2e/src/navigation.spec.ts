import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('moves between every page from the header', async ({ page }) => {
    await page.goto('/');

    const nav = page.getByRole('navigation', { name: 'Primary' });

    await nav.getByRole('link', { name: 'Services' }).click();
    await expect(page).toHaveURL(/\/services$/);
    await expect(
      page.getByRole('heading', { level: 1, name: /staging packages/i })
    ).toBeVisible();

    await nav.getByRole('link', { name: 'Portfolio' }).click();
    await expect(page).toHaveURL(/\/portfolio$/);
    await expect(
      page.getByRole('heading', { level: 1, name: /homes we staged/i })
    ).toBeVisible();

    await nav.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/\/about$/);

    await nav.getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL(/\/contact$/);
  });

  test('marks the current page with aria-current', async ({ page }) => {
    await page.goto('/services');

    const current = page
      .getByRole('navigation', { name: 'Primary' })
      .locator('a[aria-current="page"]');

    await expect(current).toHaveText('Services');
  });

  test('sets a descriptive document title per page', async ({ page }) => {
    await page.goto('/portfolio');
    await expect(page).toHaveTitle(/Portfolio — Northlight Home Staging/);
  });

  test('redirects unknown routes to the home page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /homes that photograph beautifully/i,
      })
    ).toBeVisible();
  });
});
