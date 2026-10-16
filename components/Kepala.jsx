'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Goal } from 'lucide-react';
import { arena, nav } from '@/lib/data';

export default function Kepala() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0b1220]/95 backdrop-blur">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3">
        <Link href="/" className="flex items-center gap-2"><Goal size={22} className="text-lime-400" aria-hidden="true" /><span className="text-lg font-extrabold tracking-tight">{arena.name}</span></Link>
        <nav aria-label="Utama" className="-mx-1 flex w-full gap-1 text-sm font-bold sm:mx-0 sm:w-auto">
          {nav.map((n) => {
            const aktif = n.href === '/' ? path === '/' : path?.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} aria-current={aktif ? 'page' : undefined}
                className={`flex min-h-10 flex-1 items-center justify-center rounded-lg px-2 py-2 transition sm:flex-none sm:px-3 ${aktif ? 'bg-lime-400 text-slate-900' : 'text-slate-200 hover:bg-slate-800 hover:text-lime-300'}`}>
                {n.pendek ? <><span className="sm:hidden">{n.pendek}</span><span className="hidden sm:inline">{n.label}</span></> : n.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
