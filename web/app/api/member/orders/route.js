import { NextResponse } from 'next/server';
import { getMember } from '../../../../lib/member-session';
import { prisma } from '../../../../lib/prisma';

export async function POST(request) {
  const member = await getMember(request);
  if (!member) {
    return NextResponse.json({ error: '請先登入會員。' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId: member.id, status: 'paid' },
      include: { course: { select: { title: true } } },
      orderBy: { paidAt: 'desc' },
    });

    return NextResponse.json({
      orders: orders.map((order) => ({
        id: order.id,
        orderNo: order.orderNo,
        amount: order.amount,
        status: order.status,
        paidAt: order.paidAt,
        courseTitle: order.course.title,
      })),
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: '無法讀取購買紀錄。' }, { status: 500 });
  }
}
