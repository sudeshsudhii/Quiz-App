import { NextRequest, NextResponse } from 'next/server';
import { joinSession, LiveError } from '@/lib/live';

export async function POST(req: NextRequest, ctx: RouteContext<'/api/live/[code]/join'>) {
  const { code } = await ctx.params;
  try {
    const { name } = await req.json();
    return NextResponse.json(joinSession(code, typeof name === 'string' ? name : ''));
  } catch (error) {
    if (error instanceof LiveError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: 'Could not join' }, { status: 400 });
  }
}
