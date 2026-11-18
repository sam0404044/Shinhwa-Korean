import { isTestCheckout } from '../../../../lib/payment-mode';
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
    if (!isTestCheckout()) {
      return json({
        error: '線上付款尚未啟用。請等待金流商店帳號與 HTTPS 網域設定完成。',
        code: 'PAYMENT_NOT_CONFIGURED',
      }, 503);
    }

    const orders = await prisma.$transaction(async (tx) => {
      // Serialize checkout attempts for this member so retries cannot duplicate purchases.
      await tx.$queryRaw`SELECT id FROM User WHERE id = ${member.id} FOR UPDATE`;
      const currentCourses = await tx.course.findMany({
        where: { id: { in: courseIds }, published: true },
        select: { id: true, price: true },
      });
      if (currentCourses.length !== courseIds.length) throw new Error('選擇的課程已下架或不存在。');
      const saved = [];
      for (const course of currentCourses) {
        const existing = await tx.order.findFirst({
          where: { userId: member.id, courseId: course.id, status: 'paid' },
        });
        saved.push(existing || await tx.order.create({
          data: {
            orderNo: `TEST${Date.now()}${randomBytes(3).toString('hex')}`,
            userId: member.id,
            courseId: course.id,
            amount: course.price,
            status: 'paid',
            paidAt: new Date(),
          },
        }));
      }
      await tx.cartItem.deleteMany({ where: { userId: member.id, courseId: { in: courseIds } } });
      return saved;
    });
    return json({ ok: true, testMode: true, orderIds: orders.map((order) => order.id) });

  } catch (error) {
    console.error(error);
    return json({ error: '購買失敗。' }, 500);
  }
}
