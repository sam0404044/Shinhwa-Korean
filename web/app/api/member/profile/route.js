import { NextResponse } from 'next/server';
import { getMember } from '../../../../lib/member-session';
import { prisma } from '../../../../lib/prisma';

const json = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

function sameOrigin(request) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  return !origin || !host || new URL(origin).host === host;
}

export async function GET(request) {
  const member = await getMember(request);
  if (!member) return json({ error: '請先登入會員。' }, 401);
  return json({ profile: { name: member.name || '', email: member.email } });
}

export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: '來源不符。' }, 403);
  const member = await getMember(request);
  if (!member) return json({ error: '請先登入會員。' }, 401);

  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    if (name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 191) {
      return json({ error: '請填寫有效的姓名與 Email。' }, 400);
    }
    const user = await prisma.user.update({
      where: { id: member.id },
      data: { name: name || null, email },
      select: { name: true, email: true },
    });
    return json({ profile: { name: user.name || '', email: user.email } });
  } catch (error) {
    if (error.code === 'P2002') return json({ error: '此 Email 已被使用。' }, 409);
    console.error(error);
    return json({ error: '無法儲存帳號設定。' }, 500);
  }
}
