import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { createQuiz, listQuizzes, parseQuizInput, QuizValidationError } from '@/lib/quizzes';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  return NextResponse.json({ quizzes: await listQuizzes(user.id) });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  try {
    const input = parseQuizInput(await req.json());
    const quiz = await createQuiz(user.id, input);
    return NextResponse.json({ quiz }, { status: 201 });
  } catch (error) {
    if (error instanceof QuizValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    console.error('Create quiz error:', error);
    return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 });
  }
}
