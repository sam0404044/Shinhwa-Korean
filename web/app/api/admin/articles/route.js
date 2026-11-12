import sanitizeHtml from 'sanitize-html';
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getAdmin } from '../../../../lib/admin-session';

const json = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
const sameOrigin = (request) => {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  return !origin || !host || new URL(origin).host === host;
};

function validId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function articleInput(input) {
  const title = String(input?.title || '').trim();
  const date = new Date(`${String(input?.date || '')}T00:00:00`);
  if (!title || title.length > 191) throw new Error('請填寫文章標題（最多 191 字）。');
  if (Number.isNaN(date.getTime())) throw new Error('請填寫有效日期。');
  return {
    title,
    excerpt: String(input.excerpt || '').trim() || null,
    content: sanitizeHtml(String(input.content || ''), {
      allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 's', 'u'],
      allowedAttributes: { a: ['href', 'title'], img: ['src', 'alt', 'title', 'width', 'height'] },
      allowedSchemesByTag: { img: ['http', 'https'] },
      allowProtocolRelative: false,
    }).trim() || null,
    category: String(input.category || '').trim() || null,
    imageUrl: String(input.imageUrl || '').trim() || null,
    date,
    published: input.published === true,
  };
}

export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: '來源不符。' }, 403);
  if (!await getAdmin(request)) return json({ error: '請先登入後台。' }, 401);
  try {
    const body = await request.json();
    if (body.action === 'list') return json({ articles: await prisma.article.findMany({ orderBy: [{ date: 'desc' }, { id: 'desc' }] }) });
    const id = validId(body.id);
    if (body.action === 'get') {
      const article = id ? await prisma.article.findUnique({ where: { id } }) : null;
      return article ? json({ article }) : json({ error: '找不到文章。' }, 404);
    }
    if (body.action === 'save') {
      const data = articleInput(body.article);
      const article = id ? await prisma.article.update({ where: { id }, data }) : await prisma.article.create({ data });
      return json({ ok: true, id: article.id });
    }
    if (body.action === 'delete' && id) { await prisma.article.delete({ where: { id } }); return json({ ok: true }); }
    return json({ error: '不支援的操作。' }, 400);
  } catch (error) {
    if (error.code === 'P2025') return json({ error: '找不到文章。' }, 404);
    if (error.message && !error.clientVersion) return json({ error: error.message }, 400);
    console.error(error);
    return json({ error: '文章資料處理失敗。' }, 500);
  }
}
