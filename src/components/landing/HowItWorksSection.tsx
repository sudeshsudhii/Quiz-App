const steps = [
  {
    title: 'Create a quiz',
    text: 'Add multiple-choice or true/false questions, set a time limit for each, and mark the correct answers.',
  },
  {
    title: 'Host it live',
    text: 'Start a session to get a 6-digit code. Students open the join page on their phones and enter it with a nickname.',
  },
  {
    title: 'Review the results',
    text: 'See the leaderboard after every question. Afterwards, the dashboard shows class scores and the hardest questions.',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-t border-gray-800 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="mb-12 text-center text-3xl font-bold text-white">How it works</h2>
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-gray-800 bg-[#111827] p-6">
              <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600/20 font-bold text-purple-300">
                {i + 1}
              </span>
              <h3 className="mb-2 text-lg font-semibold text-white">{s.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
