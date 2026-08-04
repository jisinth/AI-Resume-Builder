import { expect, test } from '@playwright/test';

test('a new user can register, create a resume, and see it on the dashboard', async ({ page }) => {
  const uniqueEmail = `e2e-${Date.now()}@example.com`;

  await page.goto('/register');
  await page.getByLabel('Full name').fill('E2E Test User');
  await page.getByLabel('Email').fill(uniqueEmail);
  await page.getByLabel('Password', { exact: true }).fill('StrongPass123');
  await page.getByLabel('Confirm password').fill('StrongPass123');
  await page.getByRole('button', { name: /create account/i }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  await page.getByRole('link', { name: /new resume/i }).click();
  await expect(page).toHaveURL(/\/resumes\/.+\/edit/);

  await page.getByPlaceholder('Resume title').fill('QA Engineer Resume');
  await page.waitForTimeout(2000);

  await page.goto('/dashboard');
  await expect(page.getByText('QA Engineer Resume')).toBeVisible();
});
