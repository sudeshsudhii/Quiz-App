'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/live/${code}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not join');
      try {
        sessionStorage.setItem(`player:${code}`, data.playerId);
      } catch {
        /* storage unavailable */
      }
      router.push(`/play/${code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not join');
      setLoading(false);
    }
  };

  const field =
    'w-full rounded-xl border border-gray-700 bg-[#1f2937] px-4 py-3 text-center text-white placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500';

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-gray-800 bg-[#111827] p-8 shadow-2xl">
        <h1 className="mb-1 text-center text-2xl font-bold text-white">Join a game</h1>
        <p className="mb-6 text-center text-sm text-gray-400">Enter the code shown on the host&apos;s screen</p>
        {error && (
          <p role="alert" className="mb-4 rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}
        <div className="space-y-3">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            inputMode="numeric"
            placeholder="123456"
            aria-label="Join code"
            className={`${field} text-2xl tracking-[0.3em]`}
            required
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            placeholder="Your nickname"
            aria-label="Nickname"
            className={field}
            required
          />
        </div>
        <button
          disabled={loading || code.length !== 6 || !name.trim()}
          className="mt-5 w-full cursor-pointer rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Joining…' : 'Join'}
        </button>
        <Link href="/" className="mt-4 block text-center text-sm text-gray-500 hover:text-gray-300">
          ← Home
        </Link>
      </form>
    </div>
  );
}
