import 'server-only';
import { Resend } from 'resend';
import { env } from '@/lib/env';
import { logger } from '@/lib/observability/logger';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

export async function sendEmail(input: SendEmailInput): Promise<{ id: string } | null> {
  if (!resend) {
    logger.warn({ to: input.to, subject: input.subject }, 'email_skipped_no_api_key');
    return null;
  }

  const { data, error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo ?? env.EMAIL_REPLY_TO,
  });

  if (error) {
    logger.error({ err: error, to: input.to }, 'email_send_failed');
    throw new Error(`Email send failed: ${error.message}`);
  }

  return { id: data?.id ?? '' };
}
