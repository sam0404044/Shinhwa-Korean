import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { createMemberSession, setMemberSession } from '../../../../lib/member-session';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body || {};
    if (!email || !password) {
      return NextResponse.json({ ok: false, error: '請輸入 Email 與密碼' }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { email: String(email).trim() },
    });
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return NextResponse.json({ ok: false, error: '帳號或密碼錯誤' }, { status: 401 });
    }
    if (user.status !== 'active') {
      return NextResponse.json({ ok: false, error: '帳號已停權' }, { status: 403 });
    }
    return setMemberSession(NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    }), createMemberSession(user));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: '伺服器錯誤' }, { status: 500 });
  }
}
