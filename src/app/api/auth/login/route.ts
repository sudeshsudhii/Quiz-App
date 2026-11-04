import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, verifyPassword, createToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const userPayload = {
      id: user.id,
      name: user.name || 'User',
      email: user.email,
    };

    const token = createToken(userPayload);

    const res = NextResponse.json({
      success: true,
      user: userPayload,
      message: 'Signed in successfully',
    });

    res.cookies.set('quiz_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during sign in' },
      { status: 500 }
    );
  }
}

