interface DashboardHeaderProps {
  title: string;
  description?: string;
}

export default function DashboardHeader({
  title,
  description,
}: DashboardHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-gray-400">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Filter dropdowns shell */}
        <select className="rounded-xl border border-gray-700 bg-[#1f2937] px-3 py-2 text-sm text-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
          <option>All time</option>
        </select>

        <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/40 active:scale-[0.98]">
          <span className="text-lg leading-none">+</span>
          New Session
        </button>
      </div>
    </div>
  );
}
