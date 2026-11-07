import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

function verifySignature(rawBody, signature) {
  const secret = process.env.MUX_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const timestamp = signature.match(/t=(\d+)/)?.[1];
  const signed = signature.match(/v1=([a-f0-9]+)/i)?.[1];
  if (!timestamp || !signed) return false;
  const expected = createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');
  const expectedBuffer = Buffer.from(expected, 'hex');
  const signedBuffer = Buffer.from(signed, 'hex');
  return expectedBuffer.length === signedBuffer.length && timingSafeEqual(expectedBuffer, signedBuffer);
}

export async function POST(request) {
  const rawBody = await request.text();
  if (!verifySignature(rawBody, request.headers.get('mux-signature'))) return new NextResponse('Invalid signature', { status: 401 });
  try {
    const event = JSON.parse(rawBody);
    if (event.type !== 'video.asset.ready') return NextResponse.json({ ok: true });
    const asset = event.data;
    const chapterId = String(asset?.passthrough || '').match(/^chapter:(\d+)$/)?.[1];
    const playbackId = asset?.playback_ids?.[0]?.id;
    if (!chapterId || !playbackId) return NextResponse.json({ ok: true });
    await prisma.courseChapter.update({
      where: { id: Number(chapterId) },
      data: { muxAssetId: asset.id, muxPlaybackId: playbackId },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return new NextResponse('Webhook processing failed', { status: 500 });
  }
}
