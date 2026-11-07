import { NextResponse } from 'next/server';
import { getMember } from '../../../../lib/member-session';
import { prisma } from '../../../../lib/prisma';

export async function POST(request) {
  const member = await getMember(request);
  if (!member) return NextResponse.json({ error: '請先登入會員。' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });

  try {
    const courses = await prisma.course.findMany({
      where: {
        published: true,
        OR: [{ hasTrial: true }, { orders: { some: { userId: member.id, status: 'paid' } } }],
      },
      select: {
        id: true,
        title: true,
        hasTrial: true,
        chapters: { select: { id: true } },
        orders: { where: { userId: member.id, status: 'paid' }, select: { amount: true }, take: 1 },
      },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
    return NextResponse.json({
      courses: courses.map((course) => ({
        id: course.id,
        title: course.title,
        chapterCount: course.chapters.length,
        purchased: course.orders.length > 0,
        amount: course.orders[0]?.amount || null,
        hasTrial: course.hasTrial,
      })),
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: '無法讀取課程。' }, { status: 500 });
  }
}
