import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import HostView from '@/components/live/HostView';
import { getSessionUser } from '@/lib/session';

export default function HostPage(props: PageProps<'/host/[code]'>) {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Suspense fallback={null}>
        <Host params={props.params} />
      </Suspense>
    </div>
  );
}

async function Host({ params }: { params: Promise<{ code: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect('/auth/signin');
  const { code } = await params;
  return <HostView code={code} />;
}
