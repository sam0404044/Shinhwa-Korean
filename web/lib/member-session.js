import { createHmac, timingSafeEqual } from 'node:crypto';
import { prisma } from './prisma';

const COOKIE_NAME = 'shenhua_member_session';
const SESSION_SECONDS = 60 * 60 * 24 * 7;

function sign(payload) {
  return createHmac('sha256', process.env.ADMIN_SESSION_SECRET)
    .update(`member:${payload}`)
    .digest('base64url');
}

export function createMemberSession(user) {
  if (!process.env.ADMIN_SESSION_SECRET) throw new Error('ADMIN_SESSION_SECRET is missing');
  const payload = Buffer.from(JSON.stringify({ id: user.id, exp: Date.now() + SESSION_SECONDS * 1000 })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function setMemberSession(response, token) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_SECONDS,
  });
  return response;
}

export function clearMemberSession(response) {
  response.cookies.set(COOKIE_NAME, '', { httpOnly: true, sameSite: 'strict', path: '/', maxAge: 0 });
  return response;
}

export async function getMember(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token || !process.env.ADMIN_SESSION_SECRET) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!Number.isInteger(session.id) || session.exp <= Date.now()) return null;
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { id: true, email: true, name: true, status: true },
    });
    return user?.status === 'active' ? user : null;
  } catch {
    return null;
  }
}
