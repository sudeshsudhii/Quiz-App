import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createUser, createToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN?.trim().toLowerCase().replace(/^@/, '');
    if (allowedDomain && !email.trim().toLowerCase().endsWith(`@${allowedDomain}`)) {
      return NextResponse.json(
        { error: `Staff accounts require an @${allowedDomain} email address` },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const user = await createUser(name.trim(), email.trim(), password);
    const token = createToken(user);

    const res = NextResponse.json({
      success: true,
      user,
      message: 'Account created successfully',
    });

    res.cookies.set('quiz_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while creating your account' },
      { status: 500 }
    );
  }
}

