import { NextResponse } from 'next/server';

// Staff accounts are created through Google sign-in, which proves the person owns the email.
// Open email/password sign-up is disabled because it cannot verify email ownership.
export async function POST() {
  return NextResponse.json(
    { error: 'Staff accounts are created with Google sign-in. Please use the Google button.' },
    { status: 403 }
  );
}
