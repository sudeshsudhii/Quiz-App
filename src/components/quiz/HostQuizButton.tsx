'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HostQuizButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const start = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not start a session');
      router.push(`/host/${data.code}`);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not start a session');
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={start}
      disabled={loading}
      className="cursor-pointer rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-2 text-sm font-semibold text-white transition-all hover:from-purple-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? 'Starting…' : 'Host'}
    </button>
  );
}
