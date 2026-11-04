import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Link from 'next/link';

export default function QuizzesPage() {
  return (
    <>
      <DashboardHeader
        title="My Quizzes"
        description="Create and manage your quizzes"
      />

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-700 bg-[#111827]/50 py-20">
        {/* Illustration placeholder */}
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-purple-600/10 text-5xl">
          📝
        </div>

        <h2 className="mb-2 text-xl font-semibold text-white">
          No quizzes yet
        </h2>
        <p className="mb-6 max-w-sm text-center text-sm text-gray-400">
          Create your first quiz to get started. Engage your students with
          interactive questions and real-time feedback.
        </p>

        <Link
          href="/dashboard/quizzes/new"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/40 active:scale-[0.98]"
        >
          <span className="text-lg leading-none">+</span>
          Create Quiz
        </Link>
      </div>
    </>
  );
}
