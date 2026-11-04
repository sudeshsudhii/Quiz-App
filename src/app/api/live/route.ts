import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { createSession, LiveError } from '@/lib/live';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  if (!rateLimit(`host:${user.id}`, 10, 60 * 1000)) {
    return NextResponse.json({ error: 'Too many sessions started. Please wait a minute.' }, { status: 429 });
  }

  try {
    const { quizId } = await req.json();
    if (typeof quizId !== 'string') throw new LiveError('quizId is required');
    return NextResponse.json({ code: await createSession(user.id, quizId) }, { status: 201 });
  } catch (error) {
    if (error instanceof LiveError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: 'Could not start session' }, { status: 400 });
  }
}
