import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getMember } from '../../../../lib/member-session';

const json = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request) {
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== request.headers.get('host')) return json({ error: '來源不符。' }, 403);
  const member = await getMember(request);
  if (!member) return json({ error: '請先登入會員。' }, 401);
  try {
    const body = await request.json();
    if (!['list', 'add', 'remove', 'import'].includes(body.action)) return json({ error: '購物車操作無效。' }, 400);
    const ids = body.action === 'add' ? [Number(body.courseId)] : body.ids;
    if (body.action !== 'list' && (!Array.isArray(ids) || !ids.length || ids.length > 100 ||
        ids.some((id) => !Number.isSafeInteger(Number(id)) || Number(id) < 1))) {
      return json({ error: '課程 ID 無效。' }, 400);
    }
    const data = await prisma.$transaction(async (tx) => {
      if (body.action !== 'list') {
        const users = await tx.$queryRaw`SELECT id FROM User WHERE id = ${member.id} FOR UPDATE`;
        if (!users.length) throw new Error('會員不存在。');
      }
      const orders = await tx.order.findMany({
        where: { userId: member.id, status: 'paid' }, select: { courseId: true },
      });
      const purchasedIds = [...new Set(orders.map((order) => order.courseId))];
      if (body.action === 'add') {
        const courseId = ids[0];
        const course = await tx.course.findFirst({ where: { id: courseId, published: true }, select: { id: true } });
        if (!course) return null;
        if (!purchasedIds.includes(courseId)) {
          await tx.cartItem.createMany({ data: [{ userId: member.id, courseId }], skipDuplicates: true });
        }
      }
      if (body.action === 'import') {
        const available = await tx.course.findMany({
          where: { id: { in: ids.map(Number), notIn: purchasedIds }, published: true },
          select: { id: true },
        });
        if (available.length) await tx.cartItem.createMany({
          data: available.map((course) => ({ userId: member.id, courseId: course.id })),
          skipDuplicates: true,
        });
      }
      if (body.action === 'remove') {
        await tx.cartItem.deleteMany({ where: { userId: member.id, courseId: { in: ids.map(Number) } } });
      }
      const records = await tx.cartItem.findMany({
        where: { userId: member.id, courseId: { notIn: purchasedIds } },
        include: { course: { select: { id: true, title: true, price: true, imageUrl: true, published: true } } },
        orderBy: [{ createdAt: 'asc' }, { courseId: 'asc' }],
      });
      return { items: records.map((record) => record.course), purchasedIds };
    });
    return data ? json(data) : json({ error: '課程已下架或不存在。' }, 404);
  } catch (error) {
    console.error(error);
    return json({ error: '無法更新購物車，請稍後再試。' }, 500);
  }
}
