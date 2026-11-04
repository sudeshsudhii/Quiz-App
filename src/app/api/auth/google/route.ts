import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createToken, createUser, findUserByEmail } from '@/lib/auth';
import { verifyFirebaseIdToken } from '@/lib/google';

export async function POST(req: NextRequest) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const domain = process.env.ALLOWED_EMAIL_DOMAIN?.trim().toLowerCase().replace(/^@/, '');
  if (!projectId) return NextResponse.json({ error: 'Google sign-in is not configured' }, { status: 503 });

  try {
    const { idToken } = await req.json();
    if (typeof idToken !== 'string') return NextResponse.json({ error: 'Missing token' }, { status: 400 });

    let identity;
    try {
      identity = await verifyFirebaseIdToken(idToken, projectId);
    } catch {
      return NextResponse.json({ error: 'Google sign-in could not be verified' }, { status: 401 });
    }

    // Optional limit: if ALLOWED_EMAIL_DOMAIN is set, only that domain may sign in.
    if (domain && !identity.email.endsWith(`@${domain}`)) {
      return NextResponse.json({ error: `Only @${domain} accounts can sign in as staff` }, { status: 403 });
    }

    const existing = await findUserByEmail(identity.email);
    // Google-created accounts get a random password nobody knows; they sign in with Google.
    const user = existing
      ? { id: existing.id, name: existing.name || identity.name, email: existing.email }
      : await createUser(identity.name, identity.email, crypto.randomBytes(32).toString('hex'));

    const res = NextResponse.json({ success: true, user });
    res.cookies.set('quiz_session', createToken(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });
    return res;
  } catch (error) {
    console.error('Google sign-in error:', error);
    return NextResponse.json({ error: 'Google sign-in failed' }, { status: 500 });
  }
}
