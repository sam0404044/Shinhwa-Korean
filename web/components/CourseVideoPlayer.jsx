'use client';

import { useCallback, useEffect, useRef } from 'react';
import MuxPlayer from '@mux/mux-player-react';

export default function CourseVideoPlayer({ chapterId, playbackId, title }) {
  const session = useRef(null);
  const previous = useRef(null);

  const report = useCallback(() => {
    const current = session.current;
    if (!current || current.watchedMs < 1 || current.watchedMs === current.savedMs) return;

    const watchedMs = current.watchedMs;
    fetch('/api/member/watch-time', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterId, sessionId: current.id, startedAt: current.startedAt, watchedMs }),
      keepalive: true,
    }).then((response) => {
      if (response.ok) current.savedMs = Math.max(current.savedMs, watchedMs);
    }).catch(() => {});
  }, [chapterId]);

  useEffect(() => {
    const timer = setInterval(report, 15_000);
    window.addEventListener('pagehide', report);
    return () => {
      clearInterval(timer);
      window.removeEventListener('pagehide', report);
      report();
    };
  }, [report]);

  function track(event) {
    const player = event.currentTarget;
    if (player.paused || player.seeking || !Number.isFinite(player.currentTime)) {
      previous.current = null;
      return;
    }

    const now = performance.now();
    if (!session.current || session.current.watchedMs >= 86_397_000) {
      const random = crypto.getRandomValues(new Uint8Array(16));
      const id = Array.from(random, (byte) => byte.toString(16).padStart(2, '0')).join('');
      report();
      session.current = { id, startedAt: Date.now(), watchedMs: 0, savedMs: 0 };
      previous.current = null;
    }
    const last = previous.current;
    previous.current = { now, position: player.currentTime };
    if (!last) return;

    const advanced = player.currentTime - last.position;
    const elapsed = (now - last.now) / 1000;
    const playbackRate = player.playbackRate || 1;
    if (advanced > 0 && elapsed <= 3 && advanced <= (elapsed + 0.25) * playbackRate) {
      session.current.watchedMs += Math.round(Math.min(elapsed, advanced / playbackRate) * 1000);
    }
  }

  function stopTracking() {
    previous.current = null;
    report();
  }

  return (
    <MuxPlayer
      playbackId={playbackId}
      videoTitle={title}
      style={{ width: '100%', height: '100%', borderRadius: 8 }}
      onTimeUpdate={track}
      onSeeking={stopTracking}
      onPause={stopTracking}
      onWaiting={stopTracking}
      onEnded={stopTracking}
    />
  );
}
