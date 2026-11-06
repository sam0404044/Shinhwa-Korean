import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getAdmin } from '../../../../lib/admin-session';

const json = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
const validOrigin = (request) => { const origin = request.headers.get('origin'); const host = request.headers.get('host'); return !origin || !host || new URL(origin).host === host; };
const integer = (value) => { const number = Number(value); return Number.isSafeInteger(number) && number >= 0 ? number : null; };

export async function POST(request) {
  if (!validOrigin(request)) return json({ error: '來源不符。' }, 403);
  if (!await getAdmin(request)) return json({ error: '請先登入後台。' }, 401);
  try {
    const body = await request.json();
    if (body.action === 'list') return json({ instructors: await prisma.instructor.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] }) });
    const id = Number(body.id);
    if (body.action === 'get') {
      const instructor = await prisma.instructor.findUnique({ where: { id }, include: { courses: { select: { courseId: true } } } });
      return instructor ? json({ instructor: { ...instructor, courseIds: instructor.courses.map((item) => item.courseId) } }) : json({ error: '找不到師資。' }, 404);
    }
    if (body.action === 'save') {
      const input = body.instructor || {};
      const name = String(input.name || '').trim();
      const sortOrder = integer(input.sortOrder);
      if (!name || sortOrder === null) return json({ error: '請填寫師資姓名與有效排序。' }, 400);
      const courseIds = Array.isArray(input.courseIds) ? [...new Set(input.courseIds.map(Number).filter((courseId) => Number.isSafeInteger(courseId) && courseId > 0))] : [];
      const data = { name, title: String(input.title || '').trim() || null, bio: String(input.bio || '').trim() || null, avatarUrl: String(input.avatarUrl || '').trim() || null, published: input.published === true, sortOrder };
      const instructor = id ? await prisma.$transaction(async (tx) => {
        const saved = await tx.instructor.update({ where: { id }, data });
        await tx.instructorCourse.deleteMany({ where: { instructorId: id } });
        if (courseIds.length) await tx.instructorCourse.createMany({ data: courseIds.map((courseId) => ({ instructorId: id, courseId })) });
        return saved;
      }) : await prisma.$transaction(async (tx) => {
        const saved = await tx.instructor.create({ data });
        if (courseIds.length) await tx.instructorCourse.createMany({ data: courseIds.map((courseId) => ({ instructorId: saved.id, courseId })) });
        return saved;
      });
      return json({ ok: true, id: instructor.id });
    }
    return json({ error: '未知操作。' }, 400);
  } catch (error) {
    console.error(error);
    return json({ error: '師資資料儲存失敗。' }, 500);
  }
}
