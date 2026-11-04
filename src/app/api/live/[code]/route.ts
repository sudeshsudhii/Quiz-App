import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { getView, LiveError } from '@/lib/live';

export async function GET(req: NextRequest, ctx: RouteContext<'/api/live/[code]'>) {
  const { code } = await ctx.params;
  const user = await getSessionUser();
  try {
    const view = getView(code, {
      playerId: req.nextUrl.searchParams.get('playerId'),
      hostId: user?.id ?? null,
    });
    return NextResponse.json(view, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof LiveError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
