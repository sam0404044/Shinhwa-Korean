import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { getAdmin } from '../../../../lib/admin-session';

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/app/uploads';
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const EXTENSIONS = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

function isExpectedImage(buffer, type) {
  if (type === 'image/jpeg') return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (type === 'image/png') return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  return buffer.length >= 12 && buffer.subarray(0, 4).equals(Buffer.from('RIFF')) && buffer.subarray(8, 12).equals(Buffer.from('WEBP'));
}

export async function POST(request) {
  if (!await getAdmin(request)) return NextResponse.json({ error: '請先登入後台。' }, { status: 401 });
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: '請選擇圖片檔。' }, { status: 400 });
    if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: '只接受 JPG、PNG 或 WebP 圖片。' }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: '圖片大小不可超過 5 MB。' }, { status: 400 });
    const data = Buffer.from(await file.arrayBuffer());
    if (!isExpectedImage(data, file.type)) return NextResponse.json({ error: '圖片內容與檔案格式不符。' }, { status: 400 });
    await mkdir(UPLOAD_DIR, { recursive: true });
    const filename = `${randomUUID()}.${EXTENSIONS[file.type]}`;
    await writeFile(path.join(UPLOAD_DIR, filename), data, { mode: 0o644 });
    return NextResponse.json({ ok: true, url: `/api/media/${filename}` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: '圖片上傳失敗。' }, { status: 500 });
  }
}
