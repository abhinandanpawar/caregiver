import { test, expect } from '@playwright/test';

test('homepage has expected h1', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Welcome to your Personal Dashboard' })).toBeVisible();
});

test('capture screenshots', async ({ page }) => {
  await page.goto('/');
  await page.screenshot({ path: 'screenshot.png' });

  await page.goto('/mood');
  await page.screenshot({ path: 'screenshot-mood.png' });

  await page.goto('/goals');
  await page.screenshot({ path: 'screenshot-goals.png' });

  await page.goto('/kanban');
  await page.screenshot({ path: 'screenshot-kanban.png' });
});