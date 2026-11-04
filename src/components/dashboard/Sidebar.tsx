'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/layout/Logo';

interface NavItem {
  label: string;
  icon: string;
  href: string;
}

const mainNav: NavItem[] = [
  { label: 'Analytics', icon: '▣', href: '/dashboard' },
];

const contentNav: NavItem[] = [
  { label: 'My Quizzes', icon: '⊟', href: '/dashboard/quizzes' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/signin');
      router.refresh();
    } catch {
      router.push('/auth/signin');
    }
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-gray-700 bg-[#111827] p-2 text-gray-400 lg:hidden cursor-pointer"
        aria-label="Toggle sidebar"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          {collapsed ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile overlay */}
      {collapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setCollapsed(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-800 bg-[#111827]
          transition-transform duration-200 ease-in-out
          ${collapsed ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-gray-800 px-6">
          <Logo />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {/* Main section */}
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Main
          </p>
          <ul className="mb-6 space-y-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setCollapsed(false)}
                  className={`
                    flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors
                    ${
                      isActive(item.href)
                        ? 'border-l-2 border-purple-500 bg-purple-600/20 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Content section */}
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Content
          </p>
          <ul className="space-y-1">
            {contentNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setCollapsed(false)}
                  className={`
                    flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors
                    ${
                      isActive(item.href)
                        ? 'border-l-2 border-purple-500 bg-purple-600/20 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User profile & Logout */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-xs font-bold text-white">
                {initials}
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-sm font-medium text-white">
                  {user?.name || 'Instructor'}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {user?.email || 'Logged in'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="text-gray-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
