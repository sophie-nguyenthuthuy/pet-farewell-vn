import { type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { CreateTributeSchema } from '@/lib/validation';
import { ok, fail, handleApiError } from '@/lib/api-response';
import { rateLimit, clientKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const limit = rateLimit(clientKey(req, 'tribute'), { windowMs: 60_000, max: 5 });
  if (!limit.ok) return fail('RATE_LIMITED', 'Quá nhiều yêu cầu. Vui lòng thử lại sau.', 429);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail('BAD_REQUEST', 'Invalid JSON', 400);
  }

  try {
    const parsed = CreateTributeSchema.parse(body);
    const memorial = await prisma.memorial.findUnique({ where: { id: parsed.memorialId } });
    if (!memorial) return fail('NOT_FOUND', 'Memorial not found', 404);

    const tribute = await prisma.tribute.create({ data: parsed });
    revalidatePath(`/memorial/${memorial.slug}`);
    return ok({ id: tribute.id });
  } catch (err) {
    return handleApiError(err);
  }
}
