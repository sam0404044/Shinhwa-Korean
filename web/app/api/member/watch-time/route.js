import { prisma } from '../../../../lib/prisma';
import { getMember } from '../../../../lib/member-session';

export async function POST(request) {
  const destination = request.headers.get('sec-fetch-site');
  if (destination && destination !== 'same-origin') return new Response(null, { status: 403 });

  const member = await getMember(request);
  if (!member) return new Response(null, { status: 401 });

  const { chapterId, sessionId, watchedMs, startedAt } = (await request.json().catch(() => null)) || {};
  const elapsed = Date.now() - startedAt;
  if (!Number.isSafeInteger(chapterId) || chapterId < 1 ||
      typeof sessionId !== 'string' || !/^[0-9a-f]{32}$/.test(sessionId) ||
      !Number.isSafeInteger(startedAt) || !Number.isSafeInteger(watchedMs) ||
      watchedMs < 1 || watchedMs > 86_400_000 || watchedMs > elapsed + 5000) {
    return new Response(null, { status: 400 });
  }

  const chapter = await prisma.courseChapter.findFirst({
    where: {
      id: chapterId,
      muxPlaybackId: { not: null },
      course: {
        published: true,
        OR: [{ hasTrial: true }, { orders: { some: { userId: member.id, status: 'paid' } } }],
      },
    },
    select: { id: true },
  });
  if (!chapter) return new Response(null, { status: 404 });

  const key = { userId: member.id, chapterId, sessionId };
  await prisma.$transaction([
    prisma.videoWatchSession.createMany({ data: [{ ...key, watchedMs }], skipDuplicates: true }),
    prisma.videoWatchSession.updateMany({
      where: { ...key, watchedMs: { lt: watchedMs } },
      data: { watchedMs },
    }),
  ]);
  return new Response(null, { status: 204 });
}
