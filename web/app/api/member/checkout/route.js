import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getMember } from '../../../../lib/member-session';
import { prisma } from '../../../../lib/prisma';

function json(body, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function POST(request) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && host && new URL(origin).host !== host) return json({ error: '來源不符。' }, 403);

  const member = await getMember(request);
  if (!member) return json({ error: '請先登入會員。' }, 401);

  try {
    const body = await request.json();
    const courseIds = Array.from(new Set((Array.isArray(body.courseIds) ? body.courseIds : [])
      .map((id) => Number(id)).filter((id) => Number.isSafeInteger(id) && id > 0)));
    const courses = await prisma.course.findMany({
      where: { id: { in: courseIds }, published: true },
      select: { id: true, price: true },
    });
    if (!courses.length) return json({ error: '請先選擇課程。' }, 400);
    if (courses.length !== courseIds.length) return json({ error: '選擇的課程已下架或不存在。' }, 400);

    // Actual providers require a merchant account and verified callback before payment can be marked paid.
    if (process.env.PAYMENT_PROVIDER !== 'mock' || process.env.ALLOW_MOCK_PAYMENTS !== 'true') {
      return json({
        error: '線上付款尚未啟用。請等待金流商店帳號與 HTTPS 網域設定完成。',
        code: 'PAYMENT_NOT_CONFIGURED',
      }, 503);
    }

    const orders = [];
    for (const course of courses) {
      const existingOrder = await prisma.order.findFirst({
        where: { userId: member.id, courseId: course.id, status: 'paid' },
      });
      if (existingOrder) {
        orders.push(existingOrder);
        continue;
      }

      orders.push(await prisma.order.create({
        data: {
          orderNo: `ORD${Date.now()}${randomBytes(3).toString('hex')}`,
          userId: member.id,
          courseId: course.id,
          amount: course.price,
          status: 'paid',
          paidAt: new Date(),
        },
      }));
    }

    return json({ ok: true, orderCount: orders.length });
  } catch (error) {
    console.error(error);
    return json({ error: '購買失敗。' }, 500);
  }
}
