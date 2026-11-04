import { NextResponse } from 'next/server';

// Lightweight endpoint for uptime monitors; does no database work.
export async function GET() {
  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}
