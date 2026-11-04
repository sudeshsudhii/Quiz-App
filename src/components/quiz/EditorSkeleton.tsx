export default function EditorSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6" aria-busy="true">
      <div className="h-12 w-48 animate-pulse rounded-xl bg-gray-800/60" />
      <div className="h-48 animate-pulse rounded-2xl border border-gray-800 bg-[#111827]" />
      <div className="h-80 animate-pulse rounded-2xl border border-gray-800 bg-[#111827]" />
    </div>
  );
}
