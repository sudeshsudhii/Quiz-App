import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/session';
import { listQuizzes } from '@/lib/quizzes';
import DeleteQuizButton from '@/components/quiz/DeleteQuizButton';

const createButtonClass =
  'flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/40 active:scale-[0.98]';

export default function QuizzesPage() {
  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Quizzes</h1>
          <p className="mt-1 text-sm text-gray-400">Create and manage your quizzes</p>
        </div>
        <Link href="/dashboard/quizzes/new" className={createButtonClass}>
          <span className="text-lg leading-none">+</span>
          Create Quiz
        </Link>
      </div>

      <Suspense fallback={<QuizListSkeleton />}>
        <QuizList />
      </Suspense>
    </>
  );
}

function QuizListSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" aria-busy="true">
      {[0, 1, 2].map((i) => (
        <li key={i} className="h-44 animate-pulse rounded-2xl border border-gray-800 bg-[#111827]" />
      ))}
    </ul>
  );
}

async function QuizList() {
  const user = await getSessionUser();
  if (!user) redirect('/auth/signin');

  const quizzes = listQuizzes(user.id);

  return (
    <>
      {quizzes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-700 bg-[#111827]/50 py-20">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-purple-600/10 text-5xl">
            📝
          </div>
          <h2 className="mb-2 text-xl font-semibold text-white">No quizzes yet</h2>
          <p className="mb-6 max-w-sm text-center text-sm text-gray-400">
            Create your first quiz to get started. Engage your students with interactive questions and
            real-time feedback.
          </p>
          <Link href="/dashboard/quizzes/new" className={createButtonClass}>
            <span className="text-lg leading-none">+</span>
            Create Quiz
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quizzes.map((quiz) => {
            const totalSeconds = quiz.questions.reduce((sum, q) => sum + q.timeLimit, 0);
            return (
              <li
                key={quiz.id}
                className="flex flex-col rounded-2xl border border-gray-800 bg-[#111827] p-5 transition-colors hover:border-gray-700"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h2 className="line-clamp-2 text-lg font-semibold text-white">{quiz.title}</h2>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      quiz.isPublished
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-gray-700/50 text-gray-400'
                    }`}
                  >
                    {quiz.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                {quiz.description && (
                  <p className="mb-3 line-clamp-2 text-sm text-gray-400">{quiz.description}</p>
                )}
                <p className="mb-4 mt-auto text-xs text-gray-500">
                  {quiz.questions.length} question{quiz.questions.length === 1 ? '' : 's'} · ~
                  {Math.max(1, Math.round(totalSeconds / 60))} min · Updated{' '}
                  {new Date(quiz.updatedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <div className="flex items-center gap-2 border-t border-gray-800 pt-4">
                  <Link
                    href={`/dashboard/quizzes/${quiz.id}/edit`}
                    className="flex-1 rounded-xl border border-gray-700 px-3 py-2 text-center text-sm font-medium text-gray-200 transition-colors hover:border-purple-500 hover:text-white"
                  >
                    Edit
                  </Link>
                  <DeleteQuizButton id={quiz.id} title={quiz.title} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
