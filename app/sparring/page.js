import Image from 'next/image';
import PapanSparring from '@/components/PapanSparring';
import { halaman } from '@/lib/seo';

export const metadata = halaman({
  judul: 'Cari lawan sparring',
  deskripsi: 'Papan sparring Gelanggang Petang: tim yang mencari lawan minggu ini, disaring menurut level santai, menengah, atau kompetitif. Pasang timmu sendiri.',
  path: '/sparring',
});

export default function SparringPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      {/* Kepala halaman berfoto, pola yang sama dengan kartu judul di beranda. */}
      <div className="relative isolate overflow-hidden rounded-2xl border border-slate-700 bg-[#0f1a2e] px-5 pb-6 pt-24 sm:px-8 sm:py-10">
        <Image src="/images/sparring-tanding.webp" alt="" fill priority fetchPriority="high" sizes="(min-width: 896px) 856px, 100vw" className="-z-20 object-cover object-[65%_45%]" />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-[#0b1220] via-[#0b1220]/80 to-[#0b1220]/10 sm:bg-linear-to-r sm:from-[#0b1220] sm:via-[#0b1220]/80 sm:to-[#0b1220]/10" aria-hidden="true" />
        <h1 className="text-3xl font-extrabold md:text-4xl">Cari lawan</h1>
        <p className="mt-2 max-w-md text-slate-200">Tim yang sudah booking lapangan dan masih butuh lawan. Pasang timmu, atau ajak salah satu tanding. Nama tim di papan ini fiktif.</p>
      </div>
      <div className="mt-8"><PapanSparring /></div>
    </main>
  );
}
