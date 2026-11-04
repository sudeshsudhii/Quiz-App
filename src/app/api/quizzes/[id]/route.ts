import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { deleteQuiz, getQuiz, parseQuizInput, QuizValidationError, updateQuiz } from '@/lib/quizzes';

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/quizzes/[id]'>) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const { id } = await ctx.params;
  const quiz = getQuiz(id, user.id);
  if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });

  return NextResponse.json({ quiz });
}

export async function PUT(req: NextRequest, ctx: RouteContext<'/api/quizzes/[id]'>) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const { id } = await ctx.params;
  try {
    const input = parseQuizInput(await req.json());
    const quiz = updateQuiz(id, user.id, input);
    if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    return NextResponse.json({ quiz });
  } catch (error) {
    if (error instanceof QuizValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    console.error('Update quiz error:', error);
    return NextResponse.json({ error: 'Failed to update quiz' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/quizzes/[id]'>) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const { id } = await ctx.params;
  if (!deleteQuiz(id, user.id)) {
    return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
