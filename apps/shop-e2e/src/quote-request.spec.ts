import { test, expect } from '@playwright/test';
import { gotoHydrated } from './support/hydration';

test.describe('Quote request form', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHydrated(page, '/contact');
  });

  test('blocks submission and reports errors when empty', async ({ page }) => {
    await page.getByRole('button', { name: 'Send request' }).click();

    await expect(page.getByText('Please tell us your name.')).toBeVisible();
    await expect(page.getByText('We need an email address to reply to.')).toBeVisible();
    await expect(page.getByText('Which property are we quoting?')).toBeVisible();
    await expect(
      page.getByText('Please confirm we can contact you about this request.')
    ).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Request received' })).toHaveCount(0);
  });

  test('validates the email format', async ({ page }) => {
    await page.getByLabel('Email').fill('not-an-email');
    await page.getByLabel('Phone').click();

    await expect(
      page.getByText('That does not look like a valid email address.')
    ).toBeVisible();
  });

  test('links the error to its field for assistive technology', async ({ page }) => {
    await page.getByRole('button', { name: 'Send request' }).click();

    const name = page.getByLabel('Name');
    await expect(name).toHaveAttribute('aria-invalid', 'true');
    await expect(name).toHaveAttribute('aria-describedby', 'name-error');
  });

  test('submits a complete request and confirms with a reference', async ({ page }) => {
    await page.getByLabel('Name').fill('Rowan Whitfield');
    await page.getByLabel('Email').fill('rowan@example.com');
    await page.getByLabel('Phone').fill('5035550188');
    await page.getByLabel('Property address').fill('1420 SE Ash St, Portland');
    await page.getByLabel('Approximate size (sq ft)').fill('1850');
    await page.getByLabel('Package').selectOption('vacant');
    await page.getByLabel('Timeline').selectOption('asap');
    await page.getByLabel(/You can contact me/).check();

    await page.getByRole('button', { name: 'Send request' }).click();

    await expect(page.getByRole('heading', { name: 'Request received' })).toBeVisible();
    await expect(page.getByText(/NL-RW-\d{4}/)).toBeVisible();
  });

  test('preselects the package when arriving from a service card', async ({ page }) => {
    await gotoHydrated(page, '/contact?service=luxury');
    await expect(page.getByLabel('Package')).toHaveValue('luxury');
  });
});
