import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getAdmin } from '../../../../lib/admin-session';

const json = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

function sameOrigin(request) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  return !origin || !host || new URL(origin).host === host;
}

function memberData(member) {
  return {
    id: member.id,
    email: member.email,
    name: member.name,
    phone: member.phone,
    gender: member.gender,
    birthday: member.birthday,
    status: member.status,
    createdAt: member.createdAt,
    orders: member.orders?.map((order) => ({
      id: order.id,
      title: order.course.title,
      amount: order.amount,
      status: order.status,
      paidAt: order.paidAt,
    })) || [],
  };
}

export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: '來源不符。' }, 403);
  if (!await getAdmin(request)) return json({ error: '請先登入後台。' }, 401);

  try {
    const body = await request.json();
    if (body.action === 'list') {
      const query = String(body.query || '').trim();
      const members = await prisma.user.findMany({
        where: query ? { OR: [{ email: { contains: query } }, { name: { contains: query } }] } : undefined,
        orderBy: { createdAt: 'desc' },
      });
      return json({ members: members.map(memberData) });
    }

    const id = Number(body.id);
    if (!Number.isSafeInteger(id) || id < 1) return json({ error: '會員 ID 無效。' }, 400);

    if (body.action === 'get') {
      const member = await prisma.user.findUnique({
        where: { id },
        include: { orders: { orderBy: { createdAt: 'desc' }, include: { course: { select: { title: true } } } } },
      });
      return member ? json({ member: memberData(member) }) : json({ error: '找不到會員。' }, 404);
    }

    if (body.action === 'set-status') {
      if (!['active', 'suspended'].includes(body.status)) return json({ error: '會員狀態無效。' }, 400);
      const member = await prisma.user.update({ where: { id }, data: { status: body.status } });
      return json({ ok: true, member: memberData(member) });
    }

    return json({ error: '未知操作。' }, 400);
  } catch (error) {
    if (error?.code === 'P2025') return json({ error: '找不到會員。' }, 404);
    console.error(error);
    return json({ error: '會員資料處理失敗。' }, 500);
  }
}
