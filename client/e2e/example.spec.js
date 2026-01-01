import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Smart Healthcare/);
});

test('can navigate to login', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Login');
  await expect(page).toHaveURL(/.*login/);
  await expect(page.locator('h2')).toContainText('Sign in');
});
