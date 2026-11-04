'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { OPTION_STYLES, useLiveView } from './useLiveView';
import { Leaderboard } from './HostView';

export default function PlayView({ code }: { code: string }) {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlayerId(sessionStorage.getItem(`player:${code}`));
    } catch {
      /* storage unavailable */
    }
    setReady(true);
  }, [code]);

  if (!ready) return <Center>Loading…</Center>;
  if (!playerId) {
    return (
      <Center>
        <p className="mb-4 text-white">You haven&apos;t joined this game yet.</p>
        <Link href="/join" className="text-purple-400 hover:text-purple-300">
          Enter a join code
        </Link>
      </Center>
    );
  }
  return <Game code={code} playerId={playerId} />;
}

function Game({ code, playerId }: { code: string; playerId: string }) {
  const { view, error, secondsLeft, refresh } = useLiveView(code, playerId);
  const [selected, setSelected] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const qIndex = view?.questionIndex;
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelected([]);
    setSubmitError(null);
  }, [qIndex]);

  if (error) {
    return (
      <Center>
        <p className="mb-4 text-white">{error}</p>
        <Link href="/join" className="text-purple-400">
          Join another game
        </Link>
      </Center>
    );
  }
  if (!view) return <Center>Loading…</Center>;
  if (!view.me) {
    return (
      <Center>
        <p className="mb-4 text-white">We lost your seat in this game.</p>
        <Link href="/join" className="text-purple-400">
          Rejoin
        </Link>
      </Center>
    );
  }

  const submit = async (ids: string[]) => {
    if (ids.length === 0 || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`/api/live/${code}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, optionIds: ids }),
      });
      if (!res.ok) setSubmitError((await res.json()).error || 'Could not submit');
      await refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const { me, question } = view;
  const header = (
    <div className="mb-6 flex items-center justify-between text-sm text-gray-400">
      <span className="font-medium text-white">{me.name}</span>
      <span>{me.score} pts</span>
    </div>
  );

  return (
    <div className="mx-auto min-h-screen max-w-xl px-4 py-6">
      {header}

      {view.status === 'LOBBY' && (
        <Center inline>
          <p className="mb-2 text-2xl font-bold text-white">You&apos;re in! 🎉</p>
          <p className="text-gray-400">Waiting for the host to start… ({view.playerCount} joined)</p>
        </Center>
      )}

      {view.status === 'QUESTION' && question && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {view.questionIndex + 1} / {view.totalQuestions}
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 font-bold text-white">
              {secondsLeft}
            </span>
          </div>
          <h1 className="mb-6 text-2xl font-bold text-white">{question.text}</h1>
          {me.answered ? (
            <Center inline>
              <p className="text-lg text-white">Answer locked in ✅</p>
              <p className="text-sm text-gray-400">Waiting for others…</p>
            </Center>
          ) : (
            <>
              <div className="space-y-3">
                {question.options.map((o, i) => {
                  const on = selected.includes(o.id);
                  return (
                    <button
                      key={o.id}
                      disabled={submitting}
                      onClick={() => {
                        if (question.multi) {
                          setSelected((s) => (on ? s.filter((x) => x !== o.id) : [...s, o.id]));
                        } else {
                          setSelected([o.id]);
                          submit([o.id]);
                        }
                      }}
                      className={`w-full cursor-pointer rounded-xl px-5 py-4 text-left text-lg font-semibold text-white transition-all ${
                        OPTION_STYLES[i % OPTION_STYLES.length]
                      } ${on ? 'ring-4 ring-white' : ''}`}
                    >
                      {o.text}
                    </button>
                  );
                })}
              </div>
              {question.multi && (
                <>
                  <p className="mt-3 text-sm text-gray-400">More than one answer is correct.</p>
                  <button
                    disabled={selected.length === 0 || submitting}
                    onClick={() => submit(selected)}
                    className="mt-3 w-full cursor-pointer rounded-xl bg-white py-3 font-semibold text-gray-900 disabled:opacity-40"
                  >
                    Submit
                  </button>
                </>
              )}
              {submitError && <p className="mt-3 text-sm text-red-400">{submitError}</p>}
            </>
          )}
        </div>
      )}

      {view.status === 'REVEAL' && (
        <div className="text-center">
          {me.result ? (
            <>
              <p className="mb-1 text-4xl">{me.result.correct ? '✅' : '❌'}</p>
              <p className="text-2xl font-bold text-white">{me.result.correct ? 'Correct!' : 'Not quite'}</p>
              <p className="mb-4 text-purple-300">+{me.result.points} pts</p>
            </>
          ) : (
            <p className="mb-4 text-2xl font-bold text-white">Time&apos;s up ⏰</p>
          )}
          {view.reveal?.explanation && <p className="mb-4 text-sm text-gray-300">{view.reveal.explanation}</p>}
          <p className="text-gray-400">
            You&apos;re in <strong className="text-white">#{me.rank}</strong> place
          </p>
        </div>
      )}

      {view.status === 'ENDED' && (
        <div className="text-center">
          <h1 className="mb-1 text-3xl font-bold text-white">Game over 🏆</h1>
          <p className="mb-6 text-gray-400">
            You finished #{me.rank} with {me.score} points
          </p>
          <Leaderboard rows={view.leaderboard} />
          <Link href="/join" className="mt-8 inline-block text-purple-400 hover:text-purple-300">
            Join another game
          </Link>
        </div>
      )}
    </div>
  );
}

function Center({ children, inline }: { children: React.ReactNode; inline?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center text-gray-400 ${
        inline ? 'py-16' : 'min-h-screen px-4'
      }`}
    >
      {children}
    </div>
  );
}
