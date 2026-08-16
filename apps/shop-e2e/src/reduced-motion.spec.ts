import { test, expect } from '@playwright/test';

/**
 * `test.use({ reducedMotion })` does not take effect with this project's
 * Playwright config, so the preference is emulated explicitly. It must be set
 * before navigating: the decision is made by an inline script at first paint.
 */
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
});

test.describe('Reduced motion', () => {
  test('is actually being emulated', async ({ page }) => {
    expect(
      await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
    ).toBe(true);
  });

  test('does not arm the motion layer at all', async ({ page }) => {
    await expect(page.locator('html')).not.toHaveClass(/motion-ready/);
  });

  test('leaves every revealable element fully visible', async ({ page }) => {
    const count = () =>
      page.evaluate(() => {
        const nodes = [...document.querySelectorAll('[data-reveal]')];
        return {
          total: nodes.length,
          hidden: nodes.filter((n) => Number(getComputedStyle(n).opacity) < 0.9).length,
        };
      });

    await expect.poll(async () => (await count()).total).toBeGreaterThan(0);
    await expect.poll(async () => (await count()).hidden).toBe(0);
  });

  test('shows the hero headline without waiting for an animation', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 1, name: /homes that photograph beautifully/i })
    ).toBeVisible();

    await expect
      .poll(() =>
        page.evaluate(() => {
          const word = document.querySelector('.word__inner');
          return word ? getComputedStyle(word).opacity : null;
        })
      )
      .toBe('1');
  });

  test('skips the decorative scroll progress bar', async ({ page }) => {
    await expect(page.locator('shop-scroll-progress .track')).toHaveCount(0);
  });

  test('leaves the comparison slider at its neutral midpoint', async ({ page }) => {
    // Scroll scrubbing is disabled, so the slider keeps its default value.
    await expect(page.getByRole('slider').first()).toHaveValue('50');
  });
});
