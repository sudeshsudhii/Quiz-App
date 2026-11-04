export default function TwoModesSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm text-purple-400 font-medium mb-2">Two modes</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Two superpowers. <span className="gradient-text">One platform.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Run a quiz when you want a game and present when you want a
            conversation. Use them on their own or together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Quiz Mode */}
          <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300">
            <div className="p-6 border-b border-gray-800">
              <p className="text-xs text-purple-400 font-medium mb-1">
                Quiz mode
              </p>
              <h3 className="text-xl font-semibold">
                A live game where every answer counts.
              </h3>
            </div>

            {/* Mock quiz UI */}
            <div className="p-6 bg-[#0d1117]">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Q3 / 10</span>
                <span className="text-emerald-400">● 24 live</span>
              </div>
              <p className="text-sm font-medium mb-4">
                Which planet has the most known moons?
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { l: "A", t: "Jupiter", c: "bg-red-500/20 border-red-500/30" },
                  { l: "B", t: "Saturn", c: "bg-blue-500/20 border-blue-500/30" },
                  { l: "C", t: "Uranus", c: "bg-yellow-500/20 border-yellow-500/30" },
                  { l: "D", t: "Neptune", c: "bg-green-500/20 border-green-500/30" },
                ].map((opt) => (
                  <div
                    key={opt.l}
                    className={`${opt.c} border rounded-lg p-2.5 text-xs flex items-center gap-2`}
                  >
                    <span className="font-bold">{opt.l}</span>
                    <span>{opt.t}</span>
                  </div>
                ))}
              </div>
              {/* Mini leaderboard */}
              <div className="flex gap-2 text-xs">
                {[
                  { name: "Maya", score: "2,480", rank: "1" },
                  { name: "Leo", score: "2,310", rank: "2" },
                  { name: "Sam", score: "2,150", rank: "3" },
                ].map((p) => (
                  <div
                    key={p.name}
                    className="flex-1 bg-[#1a2332] rounded-lg p-2 text-center"
                  >
                    <span className="text-gray-400">{p.name}</span>
                    <span className="block text-white font-medium">
                      {p.score}
                    </span>
                    <span className="text-purple-400 text-[10px]">#{p.rank}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">✦</span>
                  14 question types, from multiple choice to pin on image
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">✦</span>
                  A timer, speed points and a live leaderboard
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">✦</span>
                  Sure or not sure on every answer, mapped on the Confidence Grid
                </li>
              </ul>
            </div>
          </div>

          {/* Present Mode */}
          <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all duration-300">
            <div className="p-6 border-b border-gray-800">
              <p className="text-xs text-indigo-400 font-medium mb-1">
                Present mode
              </p>
              <h3 className="text-xl font-semibold">
                Slides your audience answers, live.
              </h3>
            </div>

            {/* Mock presentation UI */}
            <div className="p-6 bg-[#0d1117]">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Slide 6 of 14</span>
                <span className="text-emerald-400">● 32 live</span>
              </div>
              <p className="text-sm font-medium mb-4">
                Which topic should we review next?
              </p>
              {/* Bar chart */}
              <div className="space-y-2 mb-4">
                {[
                  { t: "Fractions", p: 44, c: "bg-purple-500" },
                  { t: "Geometry", p: 28, c: "bg-indigo-500" },
                  { t: "Algebra", p: 18, c: "bg-blue-500" },
                  { t: "Statistics", p: 10, c: "bg-cyan-500" },
                ].map((item) => (
                  <div key={item.t} className="flex items-center gap-3 text-xs">
                    <span className="w-16 text-gray-400">{item.t}</span>
                    <div className="flex-1 bg-gray-800 rounded-full h-4 overflow-hidden">
                      <div
                        className={`${item.c} h-full rounded-full`}
                        style={{ width: `${item.p}%` }}
                      />
                    </div>
                    <span className="text-gray-400 w-8 text-right">
                      {item.p}%
                    </span>
                  </div>
                ))}
              </div>
              {/* Reactions */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">32 responses</span>
                <div className="flex gap-3 text-gray-500">
                  <span>❤️ 12</span>
                  <span>👍 9</span>
                  <span>❓ 3</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-0.5">✦</span>
                  19 slide types: polls, word clouds, rankings and more
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-0.5">✦</span>
                  Results build on the big screen as the votes arrive
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-0.5">✦</span>
                  Live reactions and audience Q&A from every phone
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
