import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import QuizEditor from '@/components/quiz/QuizEditor';
import EditorSkeleton from '@/components/quiz/EditorSkeleton';
import { getSessionUser } from '@/lib/session';

export default function NewQuizPage() {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <NewQuiz />
    </Suspense>
  );
}

async function NewQuiz() {
  const user = await getSessionUser();
  if (!user) redirect('/auth/signin');

  return <QuizEditor />;
}
