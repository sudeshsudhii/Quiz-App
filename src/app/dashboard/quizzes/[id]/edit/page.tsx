import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import QuizEditor from '@/components/quiz/QuizEditor';
import EditorSkeleton from '@/components/quiz/EditorSkeleton';
import { getSessionUser } from '@/lib/session';
import { getQuiz } from '@/lib/quizzes';

export default function EditQuizPage(props: PageProps<'/dashboard/quizzes/[id]/edit'>) {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <EditQuiz params={props.params} />
    </Suspense>
  );
}

async function EditQuiz({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect('/auth/signin');

  const { id } = await params;
  const quiz = getQuiz(id, user.id);
  if (!quiz) notFound();

  return (
    <QuizEditor
      initial={{
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        isPublished: quiz.isPublished,
        questions: quiz.questions.map((q) => ({
          type: q.type,
          text: q.text,
          timeLimit: q.timeLimit,
          points: q.points,
          explanation: q.explanation,
          options: q.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect })),
        })),
      }}
    />
  );
}
