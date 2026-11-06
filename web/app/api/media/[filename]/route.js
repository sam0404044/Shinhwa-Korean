import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/app/uploads';
const CONTENT_TYPES = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };

export async function GET(_request, { params }) {
  const filename = String(params.filename || '');
  if (!/^[a-f0-9-]+\.(jpg|jpeg|png|webp)$/i.test(filename)) return new NextResponse(null, { status: 404 });
  try {
    const data = await readFile(path.join(UPLOAD_DIR, filename));
    const extension = filename.split('.').pop().toLowerCase();
    return new NextResponse(data, { headers: { 'Content-Type': CONTENT_TYPES[extension], 'Cache-Control': 'public, max-age=31536000, immutable' } });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
