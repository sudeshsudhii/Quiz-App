const footerLinks = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Live Quiz", href: "/live-quiz" },
    { label: "Presentations", href: "/interactive-presentation" },
    { label: "AI Quiz Generator", href: "/ai-quiz-generator" },
    { label: "Buzzer Room", href: "/buzzer" },
  ],
  "Built For": [
    { label: "Teachers", href: "/for/teachers" },
    { label: "Schools", href: "/for/schools" },
    { label: "Colleges", href: "/for/colleges" },
    { label: "Corporate Trainers", href: "/for/corporate-trainers" },
    { label: "Event Hosts", href: "/for/event-hosts" },
  ],
  Resources: [
    { label: "Learn", href: "/learn" },
    { label: "Templates", href: "/templates" },
    { label: "FAQ", href: "/faq" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "mailto:info@quizportal.com" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-sm">
                Q
              </div>
              <span className="text-lg font-bold gradient-text">
                QuizPortal
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Built on learning science.
              <br />
              Designed for engagement.
              <br />
              Free to start.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-gray-300 mb-3">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © 2026 QuizPortal. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Built with learning science — Confidence Grid, Learning Gain &
            Competency Mix.
          </p>
        </div>
      </div>
    </footer>
  );
}
