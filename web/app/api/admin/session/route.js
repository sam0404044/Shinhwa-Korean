import { NextResponse } from 'next/server';
import { clearAdminSession, getAdmin } from '../../../../lib/admin-session';

export async function POST(request) {
  const { action } = await request.json().catch(() => ({}));
  if (action === 'logout') return clearAdminSession(NextResponse.json({ ok: true }));
  const admin = await getAdmin(request);
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, admin });
}
