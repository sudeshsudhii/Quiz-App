"use client";

import Button from "@/components/ui/Button";

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[128px]" />
        <div className="w-[300px] h-[300px] bg-indigo-600/15 rounded-full blur-[96px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
            Get started today
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6">
          Ready to teach with <span className="gradient-text">purpose</span>?
        </h2>

        <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
          Built on evidence. Designed for real-time room engagement. Completely free to start for your classes, workshops, or training sessions.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button size="lg" href="/auth/signup" className="w-full sm:w-auto">
            Start Teaching Free
          </Button>
          <Button variant="secondary" size="lg" href="/#features" className="w-full sm:w-auto">
            Explore Features
          </Button>
        </div>

        <p className="text-xs text-gray-500">
          Free plan · No credit card required · Zero installation for students
        </p>
      </div>
    </section>
  );
}
