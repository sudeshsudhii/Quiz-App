import { NextRequest, NextResponse } from 'next/server';
import { submitAnswer, LiveError } from '@/lib/live';

export async function POST(req: NextRequest, ctx: RouteContext<'/api/live/[code]/answer'>) {
  const { code } = await ctx.params;
  try {
    const { playerId, optionIds } = await req.json();
    submitAnswer(code, String(playerId), optionIds);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof LiveError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: 'Could not submit answer' }, { status: 400 });
  }
}
