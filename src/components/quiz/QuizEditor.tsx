'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type QType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE';

interface DraftOption {
  key: string;
  text: string;
  isCorrect: boolean;
}

interface DraftQuestion {
  key: string;
  type: QType;
  text: string;
  timeLimit: number;
  points: number;
  explanation: string;
  options: DraftOption[];
}

export interface QuizEditorInitial {
  id: string;
  title: string;
  description: string | null;
  isPublished: boolean;
  questions: {
    type: QType;
    text: string;
    timeLimit: number;
    points: number;
    explanation: string | null;
    options: { text: string; isCorrect: boolean }[];
  }[];
}

const OPTION_COLORS = ['bg-red-500', 'bg-blue-500', 'bg-amber-500', 'bg-emerald-500', 'bg-pink-500', 'bg-cyan-500'];
const TIME_LIMITS = [5, 10, 20, 30, 45, 60, 90, 120];

let keyCounter = 0;
const newKey = () => `k${Date.now().toString(36)}${(keyCounter++).toString(36)}`;

const blankOptions = (type: QType): DraftOption[] =>
  type === 'TRUE_FALSE'
    ? [
        { key: newKey(), text: 'True', isCorrect: true },
        { key: newKey(), text: 'False', isCorrect: false },
      ]
    : [0, 1, 2, 3].map((i) => ({ key: newKey(), text: '', isCorrect: i === 0 }));

const blankQuestion = (type: QType = 'MULTIPLE_CHOICE'): DraftQuestion => ({
  key: newKey(),
  type,
  text: '',
  timeLimit: 30,
  points: 100,
  explanation: '',
  options: blankOptions(type),
});

export default function QuizEditor({ initial }: { initial?: QuizEditorInitial }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [questions, setQuestions] = useState<DraftQuestion[]>(() =>
    initial
      ? initial.questions.map((q) => ({
          key: newKey(),
          type: q.type,
          text: q.text,
          timeLimit: q.timeLimit,
          points: q.points,
          explanation: q.explanation ?? '',
          options: q.options.map((o) => ({ key: newKey(), text: o.text, isCorrect: o.isCorrect })),
        }))
      : [blankQuestion()]
  );
  const [saving, setSaving] = useState<null | 'draft' | 'publish'>(null);
  const [error, setError] = useState<string | null>(null);

  const updateQuestion = (key: string, patch: Partial<DraftQuestion>) =>
    setQuestions((qs) => qs.map((q) => (q.key === key ? { ...q, ...patch } : q)));

  const changeType = (key: string, type: QType) =>
    setQuestions((qs) => qs.map((q) => (q.key === key ? { ...q, type, options: blankOptions(type) } : q)));

  const moveQuestion = (index: number, delta: number) =>
    setQuestions((qs) => {
      const target = index + delta;
      if (target < 0 || target >= qs.length) return qs;
      const next = [...qs];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const duplicateQuestion = (index: number) =>
    setQuestions((qs) => {
      const src = qs[index];
      const copy: DraftQuestion = {
        ...src,
        key: newKey(),
        options: src.options.map((o) => ({ ...o, key: newKey() })),
      };
      return [...qs.slice(0, index + 1), copy, ...qs.slice(index + 1)];
    });

  const removeQuestion = (key: string) => setQuestions((qs) => qs.filter((q) => q.key !== key));

  const updateOption = (qKey: string, oKey: string, patch: Partial<DraftOption>) =>
    setQuestions((qs) =>
      qs.map((q) =>
        q.key === qKey ? { ...q, options: q.options.map((o) => (o.key === oKey ? { ...o, ...patch } : o)) } : q
      )
    );

  const toggleCorrect = (q: DraftQuestion, oKey: string) => {
    if (q.type === 'TRUE_FALSE') {
      // Exactly one correct answer for true/false.
      updateQuestion(q.key, { options: q.options.map((o) => ({ ...o, isCorrect: o.key === oKey })) });
    } else {
      updateOption(q.key, oKey, { isCorrect: !q.options.find((o) => o.key === oKey)?.isCorrect });
    }
  };

  const addOption = (q: DraftQuestion) =>
    updateQuestion(q.key, { options: [...q.options, { key: newKey(), text: '', isCorrect: false }] });

  const removeOption = (q: DraftQuestion, oKey: string) =>
    updateQuestion(q.key, { options: q.options.filter((o) => o.key !== oKey) });

  const save = async (publish: boolean) => {
    setError(null);
    setSaving(publish ? 'publish' : 'draft');
    try {
      const payload = {
        title,
        description,
        isPublished: publish,
        questions: questions.map((q) => ({
          type: q.type,
          text: q.text,
          timeLimit: q.timeLimit,
          points: q.points,
          explanation: q.explanation,
          options: q.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect })),
        })),
      };
      const res = await fetch(initial ? `/api/quizzes/${initial.id}` : '/api/quizzes', {
        method: initial ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        router.push('/auth/signin');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Failed to save quiz');
      router.push('/dashboard/quizzes');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save quiz');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(null);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-gray-700 bg-[#1f2937] px-4 py-2.5 text-white placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500';

  return (
    <div className="mx-auto max-w-4xl pb-28">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/dashboard/quizzes"
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
          aria-label="Back to quizzes"
        >
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{initial ? 'Edit Quiz' : 'Create Quiz'}</h1>
          <p className="text-sm text-gray-400">
            {questions.length} question{questions.length === 1 ? '' : 's'}
            {initial && (initial.isPublished ? ' · Published' : ' · Draft')}
          </p>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Quiz details */}
      <section className="mb-6 space-y-4 rounded-2xl border border-gray-800 bg-[#111827] p-6">
        <div>
          <label htmlFor="quiz-title" className="mb-1.5 block text-sm font-medium text-gray-300">
            Title
          </label>
          <input
            id="quiz-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            placeholder="e.g. Photosynthesis basics"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="quiz-description" className="mb-1.5 block text-sm font-medium text-gray-300">
            Description <span className="text-gray-500">(optional)</span>
          </label>
          <textarea
            id="quiz-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
            rows={2}
            placeholder="What is this quiz about?"
            className={inputClass}
          />
        </div>
      </section>

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((q, index) => (
          <section key={q.key} className="rounded-2xl border border-gray-800 bg-[#111827] p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600/20 text-sm font-bold text-purple-300">
                  {index + 1}
                </span>
                <select
                  value={q.type}
                  onChange={(e) => changeType(q.key, e.target.value as QType)}
                  aria-label={`Question ${index + 1} type`}
                  className="rounded-xl border border-gray-700 bg-[#1f2937] px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="MULTIPLE_CHOICE">Multiple choice</option>
                  <option value="TRUE_FALSE">True / False</option>
                </select>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <IconButton label="Move up" onClick={() => moveQuestion(index, -1)} disabled={index === 0}>
                  ↑
                </IconButton>
                <IconButton
                  label="Move down"
                  onClick={() => moveQuestion(index, 1)}
                  disabled={index === questions.length - 1}
                >
                  ↓
                </IconButton>
                <IconButton label="Duplicate" onClick={() => duplicateQuestion(index)}>
                  ⧉
                </IconButton>
                <IconButton label="Delete" onClick={() => removeQuestion(q.key)} danger>
                  ✕
                </IconButton>
              </div>
            </div>

            <textarea
              value={q.text}
              onChange={(e) => updateQuestion(q.key, { text: e.target.value })}
              maxLength={500}
              rows={2}
              placeholder="Type your question…"
              aria-label={`Question ${index + 1} text`}
              className={`${inputClass} mb-4 text-lg`}
            />

            <p className="mb-2 text-xs text-gray-500">
              {q.type === 'TRUE_FALSE' ? 'Select the correct answer.' : 'Tick every correct answer.'}
            </p>
            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {q.options.map((o, oi) => (
                <div
                  key={o.key}
                  className={`flex items-center gap-2 rounded-xl border p-2 transition-colors ${
                    o.isCorrect ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-gray-700 bg-[#1f2937]'
                  }`}
                >
                  <span className={`h-8 w-1.5 shrink-0 rounded-full ${OPTION_COLORS[oi % OPTION_COLORS.length]}`} />
                  {q.type === 'TRUE_FALSE' ? (
                    <span className="flex-1 px-2 text-white">{o.text}</span>
                  ) : (
                    <input
                      value={o.text}
                      onChange={(e) => updateOption(q.key, o.key, { text: e.target.value })}
                      maxLength={200}
                      placeholder={`Answer ${oi + 1}`}
                      aria-label={`Question ${index + 1} answer ${oi + 1}`}
                      className="min-w-0 flex-1 bg-transparent px-2 py-1 text-white placeholder-gray-500 focus:outline-none"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => toggleCorrect(q, o.key)}
                    aria-pressed={o.isCorrect}
                    title={o.isCorrect ? 'Correct answer' : 'Mark as correct'}
                    className={`flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border text-sm transition-colors ${
                      o.isCorrect
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-gray-600 text-transparent hover:border-emerald-500 hover:text-emerald-500'
                    }`}
                  >
                    ✓
                  </button>
                  {q.type === 'MULTIPLE_CHOICE' && q.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(q, o.key)}
                      aria-label="Remove answer"
                      className="cursor-pointer rounded p-1 text-gray-500 hover:text-red-400"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            {q.type === 'MULTIPLE_CHOICE' && q.options.length < 6 && (
              <button
                type="button"
                onClick={() => addOption(q)}
                className="mb-4 cursor-pointer text-sm font-medium text-purple-400 hover:text-purple-300"
              >
                + Add answer
              </button>
            )}

            <div className="grid grid-cols-1 gap-4 border-t border-gray-800 pt-4 sm:grid-cols-3">
              <label className="text-sm text-gray-400">
                Time limit
                <select
                  value={q.timeLimit}
                  onChange={(e) => updateQuestion(q.key, { timeLimit: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-gray-700 bg-[#1f2937] px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {TIME_LIMITS.map((t) => (
                    <option key={t} value={t}>
                      {t} seconds
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-gray-400">
                Points
                <select
                  value={q.points}
                  onChange={(e) => updateQuestion(q.key, { points: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-gray-700 bg-[#1f2937] px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={0}>No points</option>
                  <option value={100}>Standard (100)</option>
                  <option value={200}>Double (200)</option>
                </select>
              </label>
              <label className="text-sm text-gray-400 sm:col-span-1">
                Explanation <span className="text-gray-600">(optional)</span>
                <input
                  value={q.explanation}
                  onChange={(e) => updateQuestion(q.key, { explanation: e.target.value })}
                  maxLength={1000}
                  placeholder="Shown after answering"
                  className="mt-1 w-full rounded-xl border border-gray-700 bg-[#1f2937] px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </label>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setQuestions((qs) => [...qs, blankQuestion()])}
          className="flex-1 cursor-pointer rounded-2xl border border-dashed border-gray-700 py-4 text-sm font-medium text-gray-300 transition-colors hover:border-purple-500 hover:text-white"
        >
          + Multiple choice
        </button>
        <button
          type="button"
          onClick={() => setQuestions((qs) => [...qs, blankQuestion('TRUE_FALSE')])}
          className="flex-1 cursor-pointer rounded-2xl border border-dashed border-gray-700 py-4 text-sm font-medium text-gray-300 transition-colors hover:border-purple-500 hover:text-white"
        >
          + True / False
        </button>
      </div>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-800 bg-[#0a0a0f]/95 backdrop-blur lg:pl-64">
        <div className="mx-auto flex max-w-4xl items-center justify-end gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => save(false)}
            disabled={saving !== null}
            className="cursor-pointer rounded-xl border border-gray-700 px-5 py-2.5 text-sm font-semibold text-gray-300 transition-colors hover:border-gray-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving === 'draft' ? 'Saving…' : 'Save draft'}
          </button>
          <button
            type="button"
            onClick={() => save(true)}
            disabled={saving !== null}
            className="cursor-pointer rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:from-purple-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving === 'publish' ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-30 ${
        danger ? 'hover:text-red-400' : 'hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}
