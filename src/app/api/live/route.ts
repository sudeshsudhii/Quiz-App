import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { createSession, LiveError } from '@/lib/live';

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  try {
    const { quizId } = await req.json();
    if (typeof quizId !== 'string') throw new LiveError('quizId is required');
    return NextResponse.json({ code: await createSession(user.id, quizId) }, { status: 201 });
  } catch (error) {
    if (error instanceof LiveError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: 'Could not start session' }, { status: 400 });
  }
}
