const steps = [
  {
    number: "1",
    title: "Create your quiz",
    description:
      "Add questions, set time limits, choose from 19 slide types. Import from a spreadsheet or build from scratch.",
    icon: "📝",
  },
  {
    number: "2",
    title: "Share the join link",
    description:
      "Display the room code on screen or share a QR code. Students join instantly from their devices — no login needed.",
    icon: "🔗",
  },
  {
    number: "3",
    title: "Learn together",
    description:
      "Watch responses roll in live. Pause to discuss wrong answers. Celebrate top scorers on the leaderboard.",
    icon: "🎯",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Up and running in{" "}
            <span className="gradient-text">under a minute</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Three steps. That&apos;s all it takes to transform a boring review
            session into something learners remember.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-[#111827] border border-gray-800 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-sm font-bold">
                  {step.number}
                </div>
                <span className="text-2xl">{step.icon}</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-400 transition-colors">
                {step.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <span>ℹ️</span> No student account needed
          </span>
          <span className="flex items-center gap-2">
            <span>✓</span> Works on any device
          </span>
          <span className="flex items-center gap-2">
            <span>📋</span> Free forever plan
          </span>
        </div>
      </div>
    </section>
  );
}
