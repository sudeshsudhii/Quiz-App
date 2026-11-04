const glanceItems = [
  { label: "Free plan", value: "Up to 50 participants" },
  { label: "Pricing", value: "Free plan; paid plans for bigger rooms" },
  { label: "Curricula", value: "Any subject, any curriculum" },
  { label: "Use cases", value: "Schools · Colleges · Corporate" },
  { label: "Question types", value: "14 types incl. AI-generated" },
  { label: "Access", value: "Browser · No app install" },
];

const marqueeItems = [
  "Live Quizzes",
  "Interactive Presentations",
  "Buzzer Room",
  "Bloom's Taxonomy",
  "Confidence Grid",
  "Learning Gain",
  "19 Slide Types",
  "Real-time Leaderboard",
  "Host Dashboard",
  "No App Required",
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - description */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              What is <span className="gradient-text">QuizPortal</span>?
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              QuizPortal is a free{" "}
              <strong className="text-white">AI quiz generator</strong> and{" "}
              <strong className="text-white">live quiz platform</strong>. It
              combines Kahoot&apos;s real-time quiz engine with
              Mentimeter&apos;s interactive presentation features — giving
              teachers, schools, colleges, and corporate trainers a single
              browser-based tool for live quizzes, polls, word clouds, and
              presentations.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Built on peer-reviewed learning science: the Confidence Grid, a
              learning-gain check, and a competency mix for every quiz. Every
              session generates a report so teachers can see which thinking band
              needs work before the next class.
            </p>
          </div>

          {/* Right - At a glance card */}
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
            <p className="text-sm font-medium text-gray-400 mb-4">
              At a glance
            </p>
            <div className="grid grid-cols-2 gap-4">
              {glanceItems.map((item) => (
                <div
                  key={item.label}
                  className="bg-[#1a2332] rounded-xl p-3 border border-gray-800/50"
                >
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scrolling marquee */}
        <div className="mt-16 overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10" />
          <div className="flex animate-marquee">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="flex-shrink-0 px-6 py-2 text-sm text-gray-500 whitespace-nowrap"
              >
                {item} <span className="text-gray-700 ml-6">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
