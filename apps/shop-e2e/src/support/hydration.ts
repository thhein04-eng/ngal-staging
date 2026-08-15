import { Page } from '@playwright/test';

/**
 * Navigates to a route and waits until Angular has finished hydrating it.
 *
 * Every page is prerendered, so the markup — including forms and buttons — is
 * present and visible before any JavaScript runs. Interacting with it during
 * that window silently does nothing, which makes tests flaky under load.
 *
 * Angular marks server-rendered components with an `ngh` attribute and removes
 * it as each one hydrates, so the absence of `[ngh]` means the page is live.
 * This is preferred over `networkidle`, which Playwright discourages.
 */
export async function gotoHydrated(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.waitForFunction(() => document.querySelectorAll('[ngh]').length === 0);
}
