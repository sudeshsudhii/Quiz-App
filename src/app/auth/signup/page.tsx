'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/layout/Logo';
import GoogleButton from '@/components/auth/GoogleButton';

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4 py-12">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-purple-900/20 via-[#0a0a0f] to-indigo-900/20" />
      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-gray-800 bg-[#111827] p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <Logo size="lg" />
          </div>
          <h1 className="mb-1 text-center text-2xl font-bold text-white">Create a staff account</h1>
          <p className="mb-6 text-center text-sm text-gray-400">
            Continue with Google to create your account and start hosting quizzes.
          </p>

          {error && (
            <div role="alert" className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <GoogleButton onError={setError} />

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/signin" className="font-medium text-purple-400 hover:text-purple-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
