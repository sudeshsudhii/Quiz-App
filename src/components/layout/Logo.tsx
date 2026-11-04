import Link from 'next/link';
import { BRAND } from '@/lib/brand';

export default function Logo({ size = 'md', href = '/' }: { size?: 'md' | 'lg'; href?: string }) {
  const box = size === 'lg' ? 'h-10 w-10 text-lg rounded-xl' : 'h-8 w-8 text-sm rounded-lg';
  return (
    <Link href={href} className="inline-flex items-center gap-2">
      <span
        className={`flex ${box} items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 font-bold text-white shadow-md shadow-purple-500/20`}
      >
        {BRAND.name[0]}
      </span>
      <span className={`${size === 'lg' ? 'text-xl' : 'text-lg'} font-bold text-white`}>{BRAND.name}</span>
    </Link>
  );
}
