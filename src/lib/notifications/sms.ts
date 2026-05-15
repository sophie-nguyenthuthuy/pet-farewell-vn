import 'server-only';
import { env } from '@/lib/env';
import { logger } from '@/lib/observability/logger';
import { normalizeVietnamesePhone } from '@/lib/utils/phone';

export interface SmsMessage {
  to: string;
  body: string;
}

/**
 * Stubbed SMS provider. In production wire to eSMS, FPT, or VNPT.
 * Keeping the interface stable lets us swap providers without touching callers.
 */
export async function sendSms(msg: SmsMessage): Promise<{ skipped?: boolean }> {
  const to = normalizeVietnamesePhone(msg.to);
  if (!env.SMS_PROVIDER_API_KEY) {
    logger.warn({ to, body: msg.body }, 'SMS skipped: provider not configured');
    return { skipped: true };
  }
  // TODO: wire to chosen Vietnamese SMS provider
  logger.info({ to, sender: env.SMS_SENDER_ID }, 'SMS dispatched');
  return {};
}
