import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getAdmin } from '../../../../lib/admin-session';

const json = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

function sameOrigin(request) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  return !origin || !host || new URL(origin).host === host;
}

function positiveId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function muxAuth() {
  const id = process.env.MUX_TOKEN_ID;
  const secret = process.env.MUX_TOKEN_SECRET;
  return id && secret ? `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}` : null;
}

export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: '來源不符。' }, 403);
  if (!await getAdmin(request)) return json({ error: '請先登入後台。' }, 401);

  const authorization = muxAuth();
  if (!authorization) return json({ error: 'Mux 尚未設定。請先在伺服器 .env 填入 MUX_TOKEN_ID 與 MUX_TOKEN_SECRET。' }, 503);

  try {
    const body = await request.json();
    if (body.action !== 'create-upload') return json({ error: '不支援的 Mux 操作。' }, 400);
    const chapterId = positiveId(body.chapterId);
    if (!chapterId) return json({ error: '請先儲存章節，再上傳影片。' }, 400);
    const chapter = await prisma.courseChapter.findUnique({ where: { id: chapterId }, select: { id: true } });
    if (!chapter) return json({ error: '找不到章節。' }, 404);

    const origin = request.headers.get('origin') || new URL(request.url).origin;
    const response = await fetch('https://api.mux.com/video/v1/uploads', {
      method: 'POST',
      headers: { Authorization: authorization, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cors_origin: origin,
        new_asset_settings: { playback_policy: ['public'], passthrough: `chapter:${chapter.id}` },
      }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.data?.url || !payload?.data?.id) {
      console.error('Mux direct upload failed', response.status, payload);
      return json({ error: 'Mux 無法建立上傳連結。請檢查 API Token 權限。' }, 502);
    }
    await prisma.courseChapter.update({ where: { id: chapter.id }, data: { muxUploadId: payload.data.id, muxAssetId: null, muxPlaybackId: null } });
    return json({ uploadUrl: payload.data.url, uploadId: payload.data.id });
  } catch (error) {
    console.error(error);
    return json({ error: '建立 Mux 上傳連結失敗。' }, 500);
  }
}
