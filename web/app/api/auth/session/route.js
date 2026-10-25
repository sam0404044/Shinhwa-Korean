import { NextResponse } from 'next/server';
import { clearMemberSession, getMember } from '../../../../lib/member-session';

export async function POST(request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: '來源不符。' }, { status: 403 });
  }
  const body = await request.json().catch(() => ({}));
  if (body.action === 'logout') return clearMemberSession(NextResponse.json({ ok: true }));
  const member = await getMember(request);
  return member
    ? NextResponse.json({ ok: true, member })
    : NextResponse.json({ error: '請先登入。' }, { status: 401 });
}
