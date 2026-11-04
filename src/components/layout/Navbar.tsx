import Link from 'next/link';
import Logo from './Logo';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-[#0a0a0f]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link href="/join" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:text-white">
            Join a quiz
          </Link>
          <Link href="/auth/signin" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:text-white">
            Staff sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
