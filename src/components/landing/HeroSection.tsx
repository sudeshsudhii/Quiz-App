import Link from 'next/link';
import { BRAND } from '@/lib/brand';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-900/25 via-[#0a0a0f] to-indigo-900/25" />
      <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
          Run live quizzes in your classroom
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400">{BRAND.description}</p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/auth/signup"
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:from-purple-500 hover:to-indigo-500 sm:w-auto"
          >
            Create staff account
          </Link>
          <Link
            href="/join"
            className="w-full rounded-xl border border-gray-700 px-7 py-3.5 text-base font-semibold text-gray-200 transition-colors hover:border-gray-500 hover:text-white sm:w-auto"
          >
            I have a join code
          </Link>
        </div>
      </div>
    </section>
  );
}
