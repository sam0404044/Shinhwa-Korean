import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { getAdmin } from '../../../../lib/admin-session';

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/app/uploads';
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const EXTENSIONS = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

export async function POST(request) {
  if (!await getAdmin(request)) return NextResponse.json({ error: '請先登入後台。' }, { status: 401 });
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: '請選擇圖片檔。' }, { status: 400 });
    if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: '只接受 JPG、PNG 或 WebP 圖片。' }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: '圖片大小不可超過 5 MB。' }, { status: 400 });
    await mkdir(UPLOAD_DIR, { recursive: true });
    const filename = `${randomUUID()}.${EXTENSIONS[file.type]}`;
    await writeFile(path.join(UPLOAD_DIR, filename), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ ok: true, url: `/api/media/${filename}` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: '圖片上傳失敗。' }, { status: 500 });
  }
}
