import { getMember } from '../../../../lib/member-session';
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const ids = Array.from(new Set((Array.isArray(body.ids) ? body.ids : [])
      .map((id) => Number(id)).filter((id) => Number.isSafeInteger(id) && id > 0)));
    if (!ids.length) return NextResponse.json({ courses: [] }, { headers: { 'Cache-Control': 'no-store' } });
    const member = await getMember(request);
    const courses = await prisma.course.findMany({
      where: { id: { in: ids }, published: true },
      select: { id: true, title: true, price: true, imageUrl: true,
        ...(member ? { orders: { where: { userId: member.id, status: 'paid' }, select: { id: true }, take: 1 } } : {}) },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
    return NextResponse.json({ courses: courses.map(({ orders, ...course }) => ({ ...course, purchased: Boolean(orders?.length) })) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: '無法讀取課程資料。' }, { status: 500 });
  }
}
