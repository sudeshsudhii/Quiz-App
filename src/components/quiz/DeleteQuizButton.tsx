'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteQuizButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/quizzes/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete quiz');
      }
      router.refresh();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to delete quiz');
      setDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="cursor-pointer rounded-xl border border-gray-700 px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:border-red-500/50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting ? 'Deleting…' : 'Delete'}
    </button>
  );
}
