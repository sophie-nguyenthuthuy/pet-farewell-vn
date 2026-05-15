import { describe, expect, it, beforeAll } from 'vitest';

beforeAll(() => {
  process.env.VNPAY_TMN_CODE = 'TESTTMN';
  process.env.VNPAY_HASH_SECRET = 'SECRETSECRETSECRETSECRETSECRETSECRET';
  process.env.VNPAY_RETURN_URL = 'http://localhost:3000/api/webhooks/vnpay';
});

describe('vnpay', () => {
  it('builds a deterministic payment URL with a SHA-512 signature', async () => {
    const { buildVnpayUrl } = await import('@/lib/payments/vnpay');
    const url = buildVnpayUrl({
      bookingCode: 'BK-2026-000001',
      amountVnd: 3_500_000,
      ipAddress: '127.0.0.1',
      orderInfo: 'Test order',
    });
    const parsed = new URL(url);
    expect(parsed.host).toBe('sandbox.vnpayment.vn');
    expect(parsed.searchParams.get('vnp_TxnRef')).toBe('BK-2026-000001');
    expect(parsed.searchParams.get('vnp_Amount')).toBe('350000000');
    expect(parsed.searchParams.get('vnp_SecureHash')).toMatch(/^[a-f0-9]{128}$/);
  });

  it('verifyVnpaySignature accepts a signature it just produced', async () => {
    const { buildVnpayUrl, verifyVnpaySignature } = await import('@/lib/payments/vnpay');
    const url = buildVnpayUrl({
      bookingCode: 'BK-2026-000002',
      amountVnd: 1_000_000,
      ipAddress: '127.0.0.1',
      orderInfo: 'Roundtrip',
    });
    const params = Object.fromEntries(new URL(url).searchParams.entries());
    const result = verifyVnpaySignature(params);
    expect(result.valid).toBe(true);
  });

  it('verifyVnpaySignature rejects a tampered amount', async () => {
    const { buildVnpayUrl, verifyVnpaySignature } = await import('@/lib/payments/vnpay');
    const url = buildVnpayUrl({
      bookingCode: 'BK-2026-000003',
      amountVnd: 1_000_000,
      ipAddress: '127.0.0.1',
      orderInfo: 'Tamper test',
    });
    const params = Object.fromEntries(new URL(url).searchParams.entries());
    params.vnp_Amount = '100';
    expect(verifyVnpaySignature(params).valid).toBe(false);
  });
});
