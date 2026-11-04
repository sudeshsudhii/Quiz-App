"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

const answerOptions = [
  { letter: "A", color: "from-red-500 to-rose-600" },
  { letter: "B", color: "from-blue-500 to-cyan-600" },
  { letter: "C", color: "from-yellow-500 to-amber-600" },
  { letter: "D", color: "from-green-500 to-emerald-600" },
];

const builtFor = [
  { label: "Teachers", href: "/for/teachers" },
  { label: "Schools", href: "/for/schools" },
  { label: "Colleges", href: "/for/colleges" },
  { label: "Corporate trainers", href: "/for/corporate-trainers" },
  { label: "Event hosts", href: "/for/event-hosts" },
];

export default function HeroSection() {
  const [joinCode, setJoinCode] = useState("");

  return (
    <section className="relative pt-24 pb-16 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <span className="text-xs font-medium text-purple-400">
                Quiz + Presentations Platform
              </span>
            </div>

            {/* Counter */}
            <div className="inline-flex items-center gap-2 ml-3 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">
                24 / 24 live
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Live quizzes{" "}
              <span className="gradient-text">every student</span> answers.
            </h1>

            <p className="text-lg text-gray-400 mb-8 max-w-lg">
              Students join in any phone browser. You see who&apos;s sure,
              who&apos;s guessing and who&apos;s stuck.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Button size="lg" href="/auth/signup">
                Start Teaching Free
              </Button>
            </div>

            {/* Trust badges */}
            <ul className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8">
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Free forever plan
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> No credit card
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Works on slow
                connections
              </li>
            </ul>

            {/* Student join code */}
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 max-w-sm">
              <p className="text-sm text-gray-400 mb-2">Joining a session?</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  value={joinCode}
                  onChange={(e) =>
                    setJoinCode(e.target.value.replace(/\D/g, ""))
                  }
                  className="flex-1 bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Button disabled={joinCode.length !== 6} size="md">
                  Join
                </Button>
              </div>
            </div>

            {/* Built for */}
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-600 mr-1">Built for</span>
              {builtFor.map((item, i) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-xs text-gray-500 hover:text-purple-400 transition-colors"
                >
                  {item.label}
                  {i < builtFor.length - 1 && (
                    <span className="text-gray-700 ml-2">·</span>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Right side - Answer option cards */}
          <div className="hidden lg:block relative">
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {answerOptions.map((option, i) => (
                <div
                  key={option.letter}
                  className={`animate-float rounded-2xl bg-gradient-to-br ${option.color} p-6 flex items-center justify-center text-3xl font-bold text-white shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-300`}
                  style={{ animationDelay: `${i * 0.3}s` }}
                >
                  {option.letter}
                </div>
              ))}
            </div>

            {/* Mock question overlay */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 glass rounded-2xl px-6 py-3 text-center">
              <p className="text-xs text-gray-400">Q3 / 10</p>
              <p className="text-sm font-medium">
                Which planet has the most moons?
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
