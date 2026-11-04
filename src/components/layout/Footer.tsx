import Link from 'next/link';
import Logo from './Logo';
import { BRAND } from '@/lib/brand';

export default function Footer() {
  return (
    <footer className="border-t border-gray-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <Logo />
          <p className="text-xs text-gray-500">{BRAND.tagline}</p>
        </div>
        <nav className="flex gap-5 text-sm text-gray-400">
          <Link href="/join" className="hover:text-white">
            Join a quiz
          </Link>
          <Link href="/auth/signin" className="hover:text-white">
            Staff sign in
          </Link>
          <Link href="/auth/signup" className="hover:text-white">
            Create staff account
          </Link>
        </nav>
      </div>
    </footer>
  );
}
