import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getAdmin } from '../../../../lib/admin-session';

const json = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

function sameOrigin(request) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  return !origin || !host || new URL(origin).host === host;
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export async function GET(request) {
  if (!sameOrigin(request)) return json({ error: '來源不符。' }, 403);
  if (!await getAdmin(request)) return json({ error: '請先登入後台。' }, 401);

  try {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const [monthOrders, allOrders, newMemberCount, memberCount, publishedCourseCount, trialCourseCount, recentOrders, trendOrders] = await Promise.all([
      prisma.order.aggregate({ where: { status: 'paid', paidAt: { gte: currentMonthStart } }, _count: { _all: true }, _sum: { amount: true } }),
      prisma.order.aggregate({ where: { status: 'paid' }, _count: { _all: true }, _sum: { amount: true } }),
      prisma.user.count({ where: { createdAt: { gte: currentMonthStart } } }),
      prisma.user.count(),
      prisma.course.count({ where: { published: true } }),
      prisma.course.count({ where: { published: true, hasTrial: true } }),
      prisma.order.findMany({
        where: { status: 'paid' }, orderBy: { paidAt: 'desc' }, take: 5,
        include: { user: { select: { name: true, email: true } }, course: { select: { title: true } } },
      }),
      prisma.order.findMany({ where: { status: 'paid', paidAt: { gte: sixMonthsAgo } }, select: { amount: true, paidAt: true } }),
    ]);

    const monthlyMap = new Map();
    for (let offset = 5; offset >= 0; offset -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      monthlyMap.set(monthKey(date), { label: `${date.getMonth() + 1}月`, revenue: 0, sales: 0 });
    }
    for (const order of trendOrders) {
      if (!order.paidAt) continue;
      const bucket = monthlyMap.get(monthKey(order.paidAt));
      if (bucket) { bucket.revenue += order.amount; bucket.sales += 1; }
    }

    return json({
      metrics: {
        monthSales: monthOrders._count._all, monthRevenue: monthOrders._sum.amount || 0,
        totalSales: allOrders._count._all, totalRevenue: allOrders._sum.amount || 0,
        newMemberCount, memberCount, publishedCourseCount, trialCourseCount,
      },
      trend: Array.from(monthlyMap.values()),
      recentOrders: recentOrders.map((order) => ({
        id: order.id, courseTitle: order.course.title, memberName: order.user.name || order.user.email,
        amount: order.amount, paidAt: order.paidAt,
      })),
    });
  } catch (error) {
    console.error(error);
    return json({ error: '無法讀取儀表板資料。' }, 500);
  }
}
