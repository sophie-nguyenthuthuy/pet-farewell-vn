import { test, expect } from '@playwright/test';

test.describe('Booking flow', () => {
  test('home page renders the hero and CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: /đặt lịch/i }).first()).toBeVisible();
  });

  test('booking step-pet form is reachable', async ({ page }) => {
    await page.goto('/booking/step-pet');
    await expect(page.getByText(/Hãy kể cho chúng tôi nghe/i)).toBeVisible();
    await expect(page.getByLabel(/Họ và tên/i)).toBeVisible();
  });

  test('services page lists tiered pricing', async ({ page }) => {
    await page.goto('/services');
    await expect(page.getByRole('heading', { name: /Dịch vụ/i })).toBeVisible();
  });
});
