import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import { getSessionUser } from '@/lib/session';
import { computeStats, listResults } from '@/lib/results';

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader
        title="Analytics"
        description="Overview of your quiz performance and student engagement"
      />
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-[#111827]" aria-busy="true" />}>
        <Analytics />
      </Suspense>
    </>
  );
}

async function Analytics() {
  const user = await getSessionUser();
  if (!user) redirect('/auth/signin');

  const stats = computeStats(listResults(user.id));

  if (stats.totalSessions === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-700 bg-[#111827]/50 py-20 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-purple-600/10 text-5xl">📊</div>
        <h2 className="mb-2 text-xl font-semibold text-white">No results yet</h2>
        <p className="mb-6 max-w-sm text-sm text-gray-400">
          Host a quiz with at least one player and finish it. Your results will show up here.
        </p>
        <Link
          href="/dashboard/quizzes"
          className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white"
        >
          Go to My Quizzes
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard icon="📊" value={stats.totalSessions} label="Total Sessions" />
        <StatsCard icon="👥" value={stats.totalParticipants} label="Total Participants" />
        <StatsCard icon="🎯" value={`${stats.avgScorePct}%`} label="Avg Class Score" />
        <StatsCard icon="✅" value={`${stats.completionPct}%`} label="Completion Rate" />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-800 bg-[#111827] p-6">
          <h2 className="mb-1 text-lg font-semibold text-white">Class Performance Trend</h2>
          <p className="mb-4 text-xs text-gray-500">Average score per session, last {stats.trend.length}</p>
          <div className="flex h-56 items-end gap-2" role="img" aria-label="Average score per session">
            {stats.trend.map((t, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1" title={`${t.title}: ${t.pct}%`}>
                <span className="text-xs text-gray-400">{t.pct}%</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-purple-600 to-indigo-500"
                  style={{ height: `${Math.max(t.pct, 2)}%` }}
                />
                <span className="text-xs text-gray-600">{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-[#111827] p-6">
          <h2 className="mb-1 text-lg font-semibold text-white">Hardest Questions</h2>
          <p className="mb-4 text-xs text-gray-500">Lowest share of correct answers</p>
          <ul className="space-y-3">
            {stats.hardest.map((q, i) => (
              <li key={i}>
                <div className="mb-1 flex items-baseline justify-between gap-3">
                  <span className="truncate text-sm text-white">{q.text}</span>
                  <span className="shrink-0 text-sm font-semibold text-amber-400">{q.accuracy}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-gray-800">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: `${q.accuracy}%` }} />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {q.quizTitle} · {q.answered} answer{q.answered === 1 ? '' : 's'}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-800 bg-[#111827] p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Recent Sessions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-gray-500">
              <tr>
                <th className="pb-3 font-medium">Quiz</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Players</th>
                <th className="pb-3 text-right font-medium">Avg score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {stats.recent.map((r) => (
                <tr key={r.id} className="text-gray-300">
                  <td className="py-3 pr-4 text-white">{r.title}</td>
                  <td className="py-3 pr-4">
                    {new Date(r.endedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-3 pr-4">{r.players}</td>
                  <td className="py-3 text-right font-semibold text-purple-300">{r.avgPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
