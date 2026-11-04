'use client';

import { useState } from 'react';
import Link from 'next/link';
import { OPTION_STYLES, useLiveView } from './useLiveView';

const btn =
  'cursor-pointer rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:from-purple-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50';

export default function HostView({ code }: { code: string }) {
  const { view, error, secondsLeft, refresh } = useLiveView(code);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const act = async (action: 'start' | 'reveal' | 'next' | 'end') => {
    setBusy(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/live/${code}/host`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) setActionError((await res.json()).error || 'Action failed');
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  if (error) {
    return (
      <Shell>
        <p className="mb-4 text-lg text-white">{error}</p>
        <Link href="/dashboard/quizzes" className="text-purple-400 hover:text-purple-300">
          ← Back to quizzes
        </Link>
      </Shell>
    );
  }
  if (!view) return <Shell>Loading…</Shell>;

  if (!view.host) {
    return (
      <Shell>
        <p className="mb-4 text-lg text-white">Only the host can open this screen.</p>
        <Link href="/auth/signin" className="text-purple-400">
          Sign in
        </Link>
      </Shell>
    );
  }

  const { host, question, reveal } = view;
  const isLast = view.questionIndex + 1 >= view.totalQuestions;

  return (
    <div className="mx-auto min-h-screen max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between text-sm text-gray-400">
        <span>{view.title}</span>
        <span>
          Join code <strong className="ml-1 text-lg tracking-widest text-white">{view.code}</strong>
        </span>
      </div>

      {actionError && <p className="mb-4 rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-300">{actionError}</p>}

      {view.status === 'LOBBY' && (
        <div className="text-center">
          <p className="text-gray-400">Players go to</p>
          <p className="mb-1 text-xl font-semibold text-white">/join</p>
          <p className="mb-6 text-6xl font-extrabold tracking-[0.3em] text-white">{view.code}</p>
          <p className="mb-4 text-gray-400">
            {host.players.length} player{host.players.length === 1 ? '' : 's'} joined
          </p>
          <div className="mb-8 flex min-h-12 flex-wrap justify-center gap-2">
            {host.players.map((name) => (
              <span key={name} className="rounded-full bg-purple-600/20 px-3 py-1 text-sm text-purple-200">
                {name}
              </span>
            ))}
          </div>
          <button className={btn} disabled={busy} onClick={() => act('start')}>
            Start quiz
          </button>
        </div>
      )}

      {(view.status === 'QUESTION' || view.status === 'REVEAL') && question && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-400">
              Question {view.questionIndex + 1} of {view.totalQuestions}
            </span>
            {view.status === 'QUESTION' ? (
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-600 text-2xl font-bold text-white">
                {secondsLeft}
              </span>
            ) : (
              <span className="text-sm text-gray-400">Results</span>
            )}
          </div>
          <h1 className="mb-6 text-center text-3xl font-bold text-white">{question.text}</h1>
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {question.options.map((o, i) => {
              const isCorrect = reveal?.correctOptionIds.includes(o.id);
              return (
                <div
                  key={o.id}
                  className={`flex items-center justify-between rounded-xl px-5 py-4 text-lg font-semibold text-white ${
                    OPTION_STYLES[i % OPTION_STYLES.length]
                  } ${reveal && !isCorrect ? 'opacity-30' : ''}`}
                >
                  <span>
                    {reveal && isCorrect && '✓ '}
                    {o.text}
                  </span>
                  {reveal && <span>{reveal.answerCounts[o.id] ?? 0}</span>}
                </div>
              );
            })}
          </div>
          {view.status === 'QUESTION' ? (
            <div className="flex items-center justify-between">
              <span className="text-gray-400">
                {host.answeredCount} / {view.playerCount} answered
              </span>
              <button className={btn} disabled={busy} onClick={() => act('reveal')}>
                Show answer
              </button>
            </div>
          ) : (
            <>
              {reveal?.explanation && (
                <p className="mb-6 rounded-xl bg-gray-800/60 px-4 py-3 text-gray-300">{reveal.explanation}</p>
              )}
              <Leaderboard rows={view.leaderboard} />
              <div className="mt-6 text-right">
                <button className={btn} disabled={busy} onClick={() => act('next')}>
                  {isLast ? 'Finish' : 'Next question'}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {view.status === 'ENDED' && (
        <div className="text-center">
          <h1 className="mb-6 text-3xl font-bold text-white">Final results 🏆</h1>
          <Leaderboard rows={view.leaderboard} />
          <Link href="/dashboard/quizzes" className={`${btn} mt-8 inline-block`}>
            Back to quizzes
          </Link>
        </div>
      )}

      {view.status !== 'ENDED' && view.status !== 'LOBBY' && (
        <div className="mt-10 text-center">
          <button
            onClick={() => window.confirm('End the game for everyone?') && act('end')}
            className="cursor-pointer text-xs text-gray-500 hover:text-red-400"
          >
            End game now
          </button>
        </div>
      )}
    </div>
  );
}

export function Leaderboard({ rows }: { rows: { name: string; score: number }[] }) {
  if (rows.length === 0) return <p className="text-center text-gray-500">No players yet.</p>;
  return (
    <ol className="mx-auto max-w-md space-y-2">
      {rows.map((r, i) => (
        <li key={r.name} className="flex items-center justify-between rounded-xl bg-[#111827] px-4 py-3 text-white">
          <span>
            <span className="mr-3 text-gray-500">{i + 1}</span>
            {r.name}
          </span>
          <span className="font-semibold text-purple-300">{r.score}</span>
        </li>
      ))}
    </ol>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col items-center justify-center px-4 text-gray-400">{children}</div>;
}
