import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="border-t border-gray-800 py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="mb-4 text-3xl font-bold text-white">Ready to run your first quiz?</h2>
        <p className="mb-8 text-gray-400">Create a staff account and have a quiz ready in a few minutes.</p>
        <Link
          href="/auth/signup"
          className="inline-block rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:from-purple-500 hover:to-indigo-500"
        >
          Get started
        </Link>
      </div>
    </section>
  );
}
