import { z } from 'zod';

export const CreateMemorialSchema = z.object({
  petId: z.string().cuid(),
  title: z.string().min(2).max(160),
  body: z.string().min(10).max(8000),
  isPublic: z.boolean().default(true),
  coverUrl: z.string().url().optional().nullable(),
});

export const CreateTributeSchema = z.object({
  memorialId: z.string().cuid(),
  authorName: z.string().min(1).max(80),
  message: z.string().min(1).max(1000),
});

export type CreateMemorialInput = z.infer<typeof CreateMemorialSchema>;
export type CreateTributeInput = z.infer<typeof CreateTributeSchema>;
