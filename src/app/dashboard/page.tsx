import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCard from '@/components/dashboard/StatsCard';

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader
        title="Analytics"
        description="Overview of your quiz performance and student engagement"
      />

      {/* Stats row */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          icon="📊"
          value={24}
          label="Total Sessions"
          change="12%"
          changeType="up"
        />
        <StatsCard
          icon="👥"
          value={856}
          label="Total Participants"
          change="8%"
          changeType="up"
        />
        <StatsCard
          icon="🎯"
          value="73%"
          label="Avg Class Score"
          change="3%"
          changeType="down"
        />
        <StatsCard
          icon="✅"
          value="91%"
          label="Completion Rate"
          change="5%"
          changeType="up"
        />
      </div>

      {/* Charts row */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Performance trend chart placeholder */}
        <div className="rounded-2xl border border-gray-800 bg-[#111827] p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Class Performance Trend
          </h2>
          <div className="flex h-64 items-center justify-center rounded-xl bg-gray-800/50 text-sm text-gray-500">
            <div className="text-center">
              <span className="mb-2 block text-3xl">📈</span>
              Chart coming soon
            </div>
          </div>
        </div>

        {/* Confidence vs Accuracy */}
        <div className="rounded-2xl border border-gray-800 bg-[#111827] p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Confidence vs Accuracy
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Sure + Correct */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span className="text-sm font-medium text-emerald-400">
                  Sure + Correct
                </span>
              </div>
              <p className="text-2xl font-bold text-white">42%</p>
              <p className="mt-1 text-xs text-gray-400">Solid knowledge</p>
            </div>

            {/* Sure + Wrong */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-amber-400">△</span>
                <span className="text-sm font-medium text-amber-400">
                  Sure + Wrong
                </span>
              </div>
              <p className="text-2xl font-bold text-white">15%</p>
              <p className="mt-1 text-xs text-gray-400">Misconceptions</p>
            </div>

            {/* Unsure + Correct */}
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-blue-400">◇</span>
                <span className="text-sm font-medium text-blue-400">
                  Unsure + Correct
                </span>
              </div>
              <p className="text-2xl font-bold text-white">23%</p>
              <p className="mt-1 text-xs text-gray-400">Lucky / emerging</p>
            </div>

            {/* Unsure + Wrong */}
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-red-400">○</span>
                <span className="text-sm font-medium text-red-400">
                  Unsure + Wrong
                </span>
              </div>
              <p className="text-2xl font-bold text-white">20%</p>
              <p className="mt-1 text-xs text-gray-400">
                Gap — ready to learn
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-gray-600">
        Data shown is illustrative. Connect your sessions to see real analytics.
      </p>
    </>
  );
}
