"use client";

import { useState } from "react";

const faqs = [
  {
    q: "What is QuizPortal?",
    a: "QuizPortal is a free AI quiz generator and live quiz platform. It combines real-time quiz gaming with interactive presentations — polls, word clouds, rankings and more — in a single browser-based tool. No app install needed for participants.",
  },
  {
    q: "How is QuizPortal different from Kahoot, Quizizz, or Slido?",
    a: "QuizPortal combines Kahoot's game engine with Mentimeter's presentation features in one platform. It adds the Confidence Grid (metacognition), Bloom's Taxonomy tagging, and Learning Gain tracking — features built on peer-reviewed learning science. Plus, 50 participants free per session with no monthly cap.",
  },
  {
    q: "Can I generate quizzes from a PDF or textbook chapter?",
    a: "Yes! Upload a PDF, paste text, or provide a topic — our AI generates quiz questions with correct answers, distractors, and Bloom's Taxonomy levels automatically. You can review and edit every question before going live.",
  },
  {
    q: "Does QuizPortal work for corporate training?",
    a: "Absolutely. QuizPortal is used by corporate L&D teams for onboarding, compliance training, and team engagement. The Confidence Grid helps identify dangerous knowledge gaps (people who are sure but wrong), and Learning Gain proves training effectiveness.",
  },
  {
    q: "What does QuizPortal cost?",
    a: "QuizPortal has a generous free plan with up to 50 participants per session, all question types, and AI generation. Paid plans unlock larger rooms, advanced analytics, and team features. No credit card required to start.",
  },
  {
    q: "How does the AI quiz generator work?",
    a: "Powered by advanced AI, it takes your topic, learning objectives, or uploaded content and generates multiple-choice questions with plausible distractors. Each question is tagged with a Bloom's Taxonomy level so you can see the thinking mix of your quiz.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes — free forever. Up to 50 participants in every session, all 14 question types, 19 slide types, and 10 AI-generated questions per month. No monthly participant cap, no credit card, nothing to install.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center">
          Frequently asked
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
              >
                <span className="text-sm font-medium text-white pr-4">
                  {faq.q}
                </span>
                <span
                  className={`text-gray-500 text-lg flex-shrink-0 transition-transform duration-200 ${
                    open === i ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              {open === i && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

