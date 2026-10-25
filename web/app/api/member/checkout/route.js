import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getCourseById } from '../../../../data/courses';
import { getMember } from '../../../../lib/member-session';
import { prisma } from '../../../../lib/prisma';

function json(body, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

async function courseRecord(course) {
  const existing = await prisma.course.findFirst({ where: { title: course.title } });
  if (existing) return existing;

  return prisma.course.create({
    data: {
      title: course.title,
      description: course.description || null,
      price: course.price,
      priceOriginal: course.priceOriginal ?? null,
      category: course.category,
      published: true,
      sortOrder: course.sortOrder ?? 0,
      hasTrial: Boolean(course.hasTrial),
    },
  });
}

export async function POST(request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: '來源不符。' }, 403);

  const member = await getMember(request);
  if (!member) return json({ error: '請先登入會員。' }, 401);

  try {
    const body = await request.json();
    const courseIds = Array.from(new Set((Array.isArray(body.courseIds) ? body.courseIds : [])
      .map((id) => String(id))));
    const courses = courseIds.map((id) => getCourseById(id)).filter(Boolean);
    if (!courses.length) return json({ error: '請先選擇課程。' }, 400);

    const orders = [];
    for (const course of courses) {
      const record = await courseRecord(course);
      const existingOrder = await prisma.order.findFirst({
        where: { userId: member.id, courseId: record.id, status: 'paid' },
      });
      if (existingOrder) {
        orders.push(existingOrder);
        continue;
      }

      orders.push(await prisma.order.create({
        data: {
          orderNo: `ORD${Date.now()}${randomBytes(3).toString('hex')}`,
          userId: member.id,
          courseId: record.id,
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
