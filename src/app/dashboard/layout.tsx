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
        <div className="px-4 pb-6 pt-20 sm:px-6 lg:px-8 lg:py-6">{props.children}</div>
      </main>
    </div>
  );
}
