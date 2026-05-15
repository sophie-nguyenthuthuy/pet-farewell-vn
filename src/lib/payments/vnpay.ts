import 'server-only';
import crypto from 'node:crypto';
import { env } from '@/lib/env';

/**
 * Minimal VNPay payment URL builder.
 * Spec: https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html
 */

const VNPAY_ENDPOINT = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

export function buildVnpayUrl(params: {
  bookingCode: string;
  amountVnd: number;
  ipAddress: string;
  orderInfo: string;
  locale?: 'vn' | 'en';
}): string {
  if (!env.VNPAY_TMN_CODE || !env.VNPAY_HASH_SECRET || !env.VNPAY_RETURN_URL) {
    throw new Error('VNPAY credentials are not configured');
  }

  const now = new Date();
  const yyyymmddhhmmss = now
    .toISOString()
    .replace(/[-:T.Z]/g, '')
    .slice(0, 14);

  const data: Record<string, string> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: env.VNPAY_TMN_CODE,
    vnp_Amount: String(params.amountVnd * 100),
    vnp_CurrCode: 'VND',
    vnp_TxnRef: params.bookingCode,
    vnp_OrderInfo: params.orderInfo,
    vnp_OrderType: 'other',
    vnp_Locale: params.locale ?? 'vn',
    vnp_ReturnUrl: env.VNPAY_RETURN_URL,
    vnp_IpAddr: params.ipAddress,
    vnp_CreateDate: yyyymmddhhmmss,
  };

  const sorted = Object.keys(data)
    .sort()
    .map((k) => `${k}=${encodeURIComponent(data[k]!)}`)
    .join('&');

  const hmac = crypto.createHmac('sha512', env.VNPAY_HASH_SECRET);
  const signature = hmac.update(Buffer.from(sorted, 'utf-8')).digest('hex');

  return `${VNPAY_ENDPOINT}?${sorted}&vnp_SecureHash=${signature}`;
}

export function verifyVnpaySignature(
  query: Record<string, string>,
): { valid: boolean; data: Record<string, string> } {
  if (!env.VNPAY_HASH_SECRET) return { valid: false, data: query };

  const { vnp_SecureHash, vnp_SecureHashType: _vnp_SecureHashType, ...rest } = query;
  const sorted = Object.keys(rest)
    .sort()
    .map((k) => `${k}=${encodeURIComponent(rest[k]!)}`)
    .join('&');

  const hmac = crypto.createHmac('sha512', env.VNPAY_HASH_SECRET);
  const expected = hmac.update(Buffer.from(sorted, 'utf-8')).digest('hex');
  return { valid: expected === vnp_SecureHash, data: rest };
}
