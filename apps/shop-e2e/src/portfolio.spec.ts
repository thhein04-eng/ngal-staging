import { test, expect } from '@playwright/test';
import { gotoHydrated } from './support/hydration';

test.describe('Portfolio', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHydrated(page, '/portfolio');
  });

  test('shows all projects by default', async ({ page }) => {
    await expect(page.getByText('6 projects')).toBeVisible();
  });

  test('filters the archive by package', async ({ page }) => {
    // The showcase sliders above are not filtered, so scope to the archive grid.
    const archive = page.locator('.grid');

    await page.getByRole('button', { name: 'Vacant' }).click();

    await expect(page.getByRole('button', { name: 'Vacant' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await expect(page.getByText('3 projects')).toBeVisible();
    await expect(
      archive.getByRole('heading', { name: 'Pearl District Loft' })
    ).toBeVisible();
    await expect(
      archive.getByRole('heading', { name: 'Alberta Arts Craftsman' })
    ).toHaveCount(0);
  });

  test('restores the full list when All projects is selected', async ({ page }) => {
    await page.getByRole('button', { name: 'Luxury' }).click();
    await expect(page.getByText('1 project', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'All projects' }).click();
    await expect(page.getByText('6 projects')).toBeVisible();
  });
});
