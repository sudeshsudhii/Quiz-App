'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { LiveView } from '@/lib/live';

/** Polls the live session once a second and exposes a server-synced countdown. */
export function useLiveView(code: string, playerId?: string | null) {
  const [view, setView] = useState<LiveView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const offset = useRef(0); // server clock minus local clock

  const refresh = useCallback(async () => {
    try {
      const qs = playerId ? `?playerId=${encodeURIComponent(playerId)}` : '';
      const res = await fetch(`/api/live/${code}${qs}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Session not found');
        return;
      }
      offset.current = data.serverNow - Date.now();
      setError(null);
      setView(data);
    } catch {
      // transient network error: keep the last view and try again
    }
  }, [code, playerId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    const id = setInterval(refresh, 1000);
    return () => clearInterval(id);
  }, [refresh]);

  const endsAt = view?.status === 'QUESTION' ? view.endsAt : 0;
  useEffect(() => {
    if (!endsAt) return;
    const update = () => setSecondsLeft(Math.max(0, Math.ceil((endsAt - (Date.now() + offset.current)) / 1000)));
    update();
    const id = setInterval(update, 250);
    return () => clearInterval(id);
  }, [endsAt]);

  return { view, error, secondsLeft, refresh };
}

export const OPTION_STYLES = [
  'bg-red-500',
  'bg-blue-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-pink-500',
  'bg-cyan-500',
];
