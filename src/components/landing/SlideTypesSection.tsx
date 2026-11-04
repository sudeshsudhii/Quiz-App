"use client";

import { useState } from "react";

const slideTypes = [
  { name: "Multiple Choice", desc: "Classic A/B/C/D with timer", emoji: "🔤" },
  { name: "Open Text", desc: "Free-form written responses", emoji: "✏️" },
  { name: "Word Cloud", desc: "Visualize popular answers", emoji: "☁️" },
  { name: "Rating Scale", desc: "1–5 or 1–10 scales", emoji: "⭐" },
  { name: "Ranking", desc: "Drag to order preferences", emoji: "📊" },
  { name: "Image Choice", desc: "Pick from visual options", emoji: "🖼️" },
  { name: "Live Race", desc: "Speed-based competition", emoji: "🏎️" },
  { name: "Quick Fire", desc: "Rapid-fire question rounds", emoji: "⚡" },
  { name: "Emoji Pulse", desc: "React with emojis in real time", emoji: "😊" },
  { name: "Grid 2×2", desc: "Plot ideas on a matrix", emoji: "▦" },
  { name: "Pinpoint", desc: "Mark locations on an image", emoji: "📍" },
  { name: "Word Duel", desc: "Head-to-head vocabulary battles", emoji: "⚔️" },
];

export default function SlideTypesSection() {
  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <section id="slide-types" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            19 interactive slide types.{" "}
            <span className="gradient-text">And counting.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            From quick polls to collaborative word clouds — tap any card to see
            more details.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {slideTypes.map((slide, i) => (
            <div
              key={slide.name}
              onClick={() => setFlipped(flipped === i ? null : i)}
              className="cursor-pointer group"
            >
              <div
                className={`bg-[#111827] border rounded-2xl p-5 h-36 flex flex-col justify-between transition-all duration-300 ${
                  flipped === i
                    ? "border-purple-500/50 bg-purple-500/5"
                    : "border-gray-800 hover:border-gray-700"
                }`}
              >
                {flipped === i ? (
                  <div>
                    <p className="text-sm font-semibold text-purple-400 mb-2">
                      {slide.name}
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {slide.desc}. Perfect for engaging learners interactively
                      in real-time sessions.
                    </p>
                  </div>
                ) : (
                  <>
                    <span className="text-2xl">{slide.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {slide.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{slide.desc}</p>
                    </div>
                  </>
                )}
                <p className="text-[10px] text-gray-600 text-right">
                  ↔ Tap to flip
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          + 7 more display & utility slide types (title, bullets, quote, video,
          image, scale, wheel)
        </p>
      </div>
    </section>
  );
}

