import { Suspense } from 'react';
import PlayView from '@/components/live/PlayView';

export default function PlayPage(props: PageProps<'/play/[code]'>) {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Suspense fallback={null}>
        <Play params={props.params} />
      </Suspense>
    </div>
  );
}

async function Play({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <PlayView code={code} />;
}
