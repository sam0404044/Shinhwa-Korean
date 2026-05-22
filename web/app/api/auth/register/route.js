import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../../lib/prisma';

function clean(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function parseBirthday(value) {
  if (!value) {
    return null;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      name,
      gender,
      birthday,
      phone,
      addressRegion,
      taiwanAddress,
      overseasAddress,
      motivation,
      motivationOther,
    } = body || {};

    const normalizedEmail = clean(email);
    const normalizedPassword = clean(password);

    if (!normalizedEmail || !normalizedPassword) {
      return NextResponse.json({ ok: false, error: '請輸入 Email 和密碼。' }, { status: 400 });
    }

    if (!clean(name) || !clean(phone)) {
      return NextResponse.json({ ok: false, error: '請填寫姓名和電話。' }, { status: 400 });
    }

    if (normalizedPassword.length < 8) {
      return NextResponse.json({ ok: false, error: '密碼至少需要 8 碼。' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json({ ok: false, error: '這個 Email 已經註冊過。' }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash: bcrypt.hashSync(normalizedPassword, 10),
        name: clean(name),
        gender: clean(gender),
        birthday: parseBirthday(clean(birthday)),
        phone: clean(phone),
        addressRegion: clean(addressRegion),
        taiwanAddress: clean(taiwanAddress),
        overseasAddress: clean(overseasAddress),
        motivation: clean(motivation),
        motivationOther: clean(motivationOther),
        status: 'active',
      },
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: '註冊失敗，請稍後再試。' }, { status: 500 });
  }
}
