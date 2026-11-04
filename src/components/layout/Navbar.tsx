"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Slide Types", href: "#slide-types" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-sm">
              Q
            </div>
            <span className="text-xl font-bold gradient-text">QuizPortal</span>
          </a>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#1f2937] rounded-xl border border-gray-700 px-2">
              <input
                type="text"
                placeholder="Join code"
                maxLength={6}
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, ""))}
                className="w-20 bg-transparent text-sm text-white placeholder-gray-500 py-2 focus:outline-none"
              />
              <button
                disabled={joinCode.length !== 6}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                Join
              </button>
            </div>
            <a
              href="/auth/signin"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Sign in
            </a>
            <Button size="sm" href="/auth/signup">
              Sign up
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-gray-800">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-sm text-gray-400 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-gray-800 flex flex-col gap-2">
              <Button variant="secondary" size="sm" href="/auth/signin">
                Sign in
              </Button>
              <Button size="sm" href="/auth/signup">
                Sign up
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
