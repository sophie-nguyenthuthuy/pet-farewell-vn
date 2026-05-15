import { test, expect } from '@playwright/test';

test.describe('Marketing & navigation', () => {
  test('home page renders the hero and primary CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: /đặt lịch/i }).first()).toBeVisible();
  });

  test('services page lists tiered pricing', async ({ page }) => {
    await page.goto('/services');
    await expect(page.getByRole('heading', { name: /Dịch vụ/i })).toBeVisible();
  });

  test('pricing page renders the table', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByRole('heading', { name: /Bảng giá/i })).toBeVisible();
  });
});

test.describe('Booking wizard', () => {
  test('opens on the pet step', async ({ page }) => {
    await page.goto('/booking/step-pet');
    await expect(page.getByText(/Hãy kể cho chúng tôi nghe/i)).toBeVisible();
    await expect(page.getByLabel(/Tên bé yêu/i)).toBeVisible();
  });

  test('blocks advancing without a pet name', async ({ page }) => {
    await page.goto('/booking/step-pet');
    await page.getByRole('button', { name: /Tiếp tục/i }).click();
    await expect(page.getByText(/Vui lòng nhập tên bé/i)).toBeVisible();
  });
});

test.describe('Memorial', () => {
  test('memorial wall renders', async ({ page }) => {
    await page.goto('/memorial');
    await expect(page.getByRole('heading', { name: /Vườn tưởng niệm/i })).toBeVisible();
  });
});

test.describe('Health', () => {
  test('health endpoint returns ok or degraded JSON', async ({ request }) => {
    const res = await request.get('/api/health');
    expect([200, 503]).toContain(res.status());
    const body = (await res.json()) as { status: string };
    expect(['ok', 'degraded']).toContain(body.status);
  });
});
