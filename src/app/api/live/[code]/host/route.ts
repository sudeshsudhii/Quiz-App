import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { hostAction, LiveError, type HostAction } from '@/lib/live';

export async function POST(req: NextRequest, ctx: RouteContext<'/api/live/[code]/host'>) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const { code } = await ctx.params;
  try {
    const { action } = await req.json();
    await hostAction(code, user.id, action as HostAction);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof LiveError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: 'Action failed' }, { status: 400 });
  }
}
