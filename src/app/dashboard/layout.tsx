import { Suspense } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout(props: LayoutProps<'/dashboard'>) {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>
      {/* Main content area — offset for the sidebar */}
      <main className="lg:pl-64">
        <div className="px-4 py-6 sm:px-6 lg:px-8">{props.children}</div>
      </main>
    </div>
  );
}
