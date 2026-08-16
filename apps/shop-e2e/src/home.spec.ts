import { test, expect } from '@playwright/test';
import { gotoHydrated } from './support/hydration';

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHydrated(page, '/');
  });

  test('shows the hero headline and both calls to action', async ({ page }) => {
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /homes that photograph beautifully/i,
      })
    ).toBeVisible();

    await expect(page.getByRole('link', { name: 'Request a quote' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'See the work' })).toBeVisible();
  });

  test('renders the impact stats', async ({ page }) => {
    await expect(page.getByText('Average time to pending')).toBeVisible();
    await expect(page.getByText('Homes staged since 2014')).toBeVisible();
  });

  test('exposes the before/after comparison as a keyboard operable slider', async ({
    page,
  }) => {
    const slider = page.getByRole('slider').first();
    await expect(slider).toBeVisible();
    await expect(slider).toHaveAttribute('min', '0');
    await expect(slider).toHaveAttribute('max', '100');

    await slider.scrollIntoViewIfNeeded();
    const start = Number(await slider.inputValue());

    await slider.focus();
    await page.keyboard.press('ArrowRight');
    await expect(slider).toHaveValue(String(start + 1));
  });

  test('keyboard control takes over from the scroll-driven wipe', async ({ page }) => {
    const slider = page.getByRole('slider').first();

    await slider.scrollIntoViewIfNeeded();
    await slider.focus();
    await page.keyboard.press('ArrowRight');
    const afterKey = await slider.inputValue();

    // Scrolling must no longer move the wipe once the visitor has taken control.
    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 500);
    await page.waitForFunction((y) => window.scrollY > y, before);

    await expect(slider).toHaveValue(afterKey);
  });

  test('lists all four staging packages', async ({ page }) => {
    for (const name of [
      'Staging Consultation',
      'Occupied Staging',
      'Vacant Staging',
      'Luxury Portfolio',
    ]) {
      await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
    }
  });

  test('skip link moves focus to the main landmark', async ({ page }) => {
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skip).toBeFocused();
  });
});
