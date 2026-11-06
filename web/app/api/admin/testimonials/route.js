import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getAdmin } from '../../../../lib/admin-session';

const json = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
const sameOrigin = (request) => {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  return !origin || !host || new URL(origin).host === host;
};
const validId = (value) => {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};

function testimonialInput(input) {
  const name = String(input?.name || '').trim();
  if (!name || name.length > 191) throw new Error('請填寫學員姓名（最多 191 字）。');
  return {
    name,
    role: String(input.role || '').trim() || null,
    industry: String(input.industry || '').trim() || null,
    quote: String(input.quote || '').trim(),
    quoteShort: String(input.quoteShort || '').trim() || null,
    avatarUrl: String(input.avatarUrl || '').trim() || null,
    courseRecommend: String(input.courseRecommend || '').trim() || null,
    showOnHome: input.showOnHome === true,
    sortOrder: Math.max(0, Number.parseInt(input.sortOrder, 10) || 0),
  };
}

export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: '來源不符。' }, 403);
  if (!await getAdmin(request)) return json({ error: '請先登入後台。' }, 401);
  try {
    const body = await request.json();
    if (body.action === 'list') return json({ testimonials: await prisma.testimonial.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'desc' }] }) });
    const id = validId(body.id);
    if (body.action === 'get') {
      const testimonial = id ? await prisma.testimonial.findUnique({ where: { id } }) : null;
      return testimonial ? json({ testimonial }) : json({ error: '找不到學員見證。' }, 404);
    }
    if (body.action === 'save') {
      const data = testimonialInput(body.testimonial);
      const testimonial = id ? await prisma.testimonial.update({ where: { id }, data }) : await prisma.testimonial.create({ data });
      return json({ ok: true, id: testimonial.id });
    }
    if (body.action === 'delete' && id) { await prisma.testimonial.delete({ where: { id } }); return json({ ok: true }); }
    return json({ error: '不支援的操作。' }, 400);
  } catch (error) {
    if (error.code === 'P2025') return json({ error: '找不到學員見證。' }, 404);
    if (error.message && !error.clientVersion) return json({ error: error.message }, 400);
    console.error(error);
    return json({ error: '學員見證資料處理失敗。' }, 500);
  }
}
