import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { createAdminSession, setAdminSession } from '../../../../lib/admin-session';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body || {};
    if (!email || !password) {
      return NextResponse.json({ ok: false, error: '請輸入帳號與密碼' }, { status: 400 });
    }
    const admin = await prisma.admin.findUnique({ where: { email: String(email).trim() } });
    if (!admin || !bcrypt.compareSync(password, admin.passwordHash)) {
      return NextResponse.json({ ok: false, error: '帳號或密碼錯誤' }, { status: 401 });
    }
    return setAdminSession(NextResponse.json({ ok: true, email: admin.email }), createAdminSession(admin));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: '伺服器錯誤' }, { status: 500 });
  }
}
