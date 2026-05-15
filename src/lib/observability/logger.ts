import pino from 'pino';
import { env, isDev } from '@/lib/env';

export const logger = pino({
  level: env.LOG_LEVEL,
  base: { service: 'pet-farewell-vn', env: env.NODE_ENV },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      '*.password',
      '*.hashedPassword',
      '*.token',
      '*.secret',
    ],
    censor: '[REDACTED]',
  },
  transport: isDev
    ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:HH:MM:ss' } }
    : undefined,
});

export type Logger = typeof logger;
