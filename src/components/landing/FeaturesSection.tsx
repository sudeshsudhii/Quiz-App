const features = [
  { title: 'No student accounts', text: 'Students only need the code and a nickname. Staff sign in to create and host.' },
  { title: 'Works on any phone', text: 'Students join from a browser. Nothing to install.' },
  { title: 'Timed questions', text: 'Each question has its own countdown, and the answer is revealed when time is up.' },
  { title: 'Speed-based scoring', text: 'Correct answers earn more points the faster they come in.' },
  { title: 'Explanations', text: 'Add a short explanation to any question and show it after the answer.' },
  { title: 'Results dashboard', text: 'Track class averages, completion and the questions students found hardest.' },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="border-t border-gray-800 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="mb-12 text-center text-3xl font-bold text-white">What you get</h2>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <li key={f.title} className="rounded-2xl border border-gray-800 bg-[#111827] p-6">
              <h3 className="mb-2 font-semibold text-white">{f.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{f.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
