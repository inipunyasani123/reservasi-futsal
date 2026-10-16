'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Check, User, Phone, X, Sun, Moon, Flame, ArrowDown } from 'lucide-react';
import { arena, courts, hours, hargaSlot, golonganJam, terisiContoh } from '@/lib/data';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { useHariIni } from '@/lib/useHariIni';
import { useDialog } from '@/lib/useDialog';
import { tambahHari, hariKe, fmtTanggal, sudahLewat, rupiah, kodePesan } from '@/lib/waktu';

const key = (c, h) => `${c}-${h}`;
const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const IKON = { siang: Sun, emas: Flame, malam: Moon };

export default function FutsalApp() {
  const { hari, sekarang } = useHariIni(60);
  const [punyaku, setPunyaku] = useLocalStorage('gelanggangpetang.booking', []);
  const [date, setDate] = useState(null);
  const [picked, setPicked] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [done, setDone] = useState(null);
  const dialog = useDialog(!!done, () => setDone(null));
  // Bilah ringkasan di ponsel tampil selama formulir belum terlihat di layar.
  const formRef = useRef(null);
  const [formTerlihat, setFormTerlihat] = useState(false);
  const adaPilihan = picked.length > 0;
  useEffect(() => {
    const el = formRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setFormTerlihat(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [adaPilihan]);
  const keFormulir = () => {
    const el = formRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    el.querySelector('input')?.focus({ preventScroll: true });
  };

  const lewat = (d, h) => (sekarang ? sudahLewat(d, h, 10, sekarang) : true);
  const hariPil = useMemo(() => (hari ? Array.from({ length: 7 }, (_, i) => tambahHari(hari, i)) : []), [hari]);
  useEffect(() => {
    if (!hari || date) return;
    setDate(hours.some((h) => !lewat(hari, h)) ? hari : tambahHari(hari, 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hari]);

  const bookedSet = useMemo(() => {
    if (!date) return new Set();
    const s = terisiContoh(date);
    punyaku.filter((r) => r.date === date).forEach((r) => s.add(key(r.courtId, r.hour)));
    return s;
  }, [punyaku, date]);

  const penuh = picked.length >= arena.maksSlot;
  const toggle = (c, h) => {
    const k = key(c, h);
    if (bookedSet.has(k) || lewat(date, h)) return;
    setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : p.length >= arena.maksSlot ? p : [...p, k]));
  };
  const total = picked.reduce((a, k) => a + hargaSlot(date, k.split('-')[1]), 0);

  const confirm = (e) => {
    e.preventDefault();
    if (!picked.length || !form.name.trim() || !form.phone.trim()) return;
    const grup = `f-${Date.now()}`;
    const kode = kodePesan('GP', grup);
    const slots = [...picked].sort().map((k) => { const [courtId, hour] = k.split('-'); return { id: `${grup}-${k}`, grup, kode, date, courtId, hour, harga: hargaSlot(date, hour), ...form }; });
    setPunyaku((p) => [...p, ...slots]);
    setDone({ kode, slots, total, name: form.name, date });
    setPicked([]); setForm({ name: '', phone: '' });
  };

  return (
    <div className={adaPilihan && !formTerlihat ? 'pb-24 sm:pb-10' : 'pb-10'}>
      <main className="mx-auto max-w-4xl px-5 py-6">
        <div className="mb-6 grid gap-3 sm:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-slate-700 bg-gradient-to-r from-slate-900 via-slate-800 to-lime-950 p-5">
            <h1 className="text-2xl font-extrabold">Booking lapangan</h1>
            <p className="mt-1 text-sm text-slate-300">Pilih sampai {arena.maksSlot} jam sekaligus, boleh beda lapangan. Harga tertera di tiap kotak.</p>
          </div>
          <Link href="/sparring" className="group rounded-2xl border border-lime-400/40 bg-lime-400/10 p-5 transition hover:bg-lime-400/15">
            <p className="text-sm font-bold text-lime-300">Belum punya lawan?</p>
            <p className="mt-1 text-sm text-slate-200">Lihat tim yang sedang cari sparring minggu ini →</p>
          </Link>
        </div>

        <div className="mb-4 flex flex-col gap-3">
          <h2 className="text-lg font-bold">Tanggal{date && <span className="font-normal text-slate-300"> · {date === hari ? 'hari ini, ' : date === hariPil[1] ? 'besok, ' : ''}{fmtTanggal(date)}</span>}</h2>
          {/* Kerangka seukuran isi aslinya: tanggal WIB baru diketahui di peramban, jadi tata letak tidak bergeser. */}
          {!hari ? (
            <div className="grid grid-cols-7 gap-1.5 sm:flex sm:gap-2" role="status">
              <span className="sr-only">Memuat tanggal…</span>
              {Array.from({ length: 7 }, (_, i) => <span key={i} className="h-[3.75rem] rounded-lg border-2 border-slate-800 bg-slate-800/60 sm:w-[4.5rem]" aria-hidden="true" />)}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1.5 sm:flex sm:gap-2">
              {hariPil.map((d, i) => {
                const active = date === d; const habis = hours.every((h) => lewat(d, h));
                return (
                  <button key={d} type="button" disabled={habis} onClick={() => { setDate(d); setPicked([]); }} aria-pressed={active}
                    className={`flex h-[3.75rem] flex-col items-center justify-center rounded-lg border-2 px-0.5 py-1 transition disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[4.5rem] sm:px-3 ${active ? 'border-lime-400 bg-lime-400/10 text-lime-300' : 'border-slate-700 bg-slate-800 text-slate-100 hover:border-lime-400/50'}`}>
                    <span className="text-[11px] font-bold uppercase tracking-wide">{HARI[hariKe(d)]}</span>{' '}
                    <span className="text-lg font-extrabold leading-tight">{Number(d.slice(8))}</span>
                    <span className="sr-only"> {fmtTanggal(d, { month: 'long' })}{i === 0 ? ', hari ini' : i === 1 ? ', besok' : ''}{habis ? ', semua jam sudah lewat' : ''}</span>
                    {i === 0 && <span className="mt-0.5 h-1 w-1 rounded-full bg-current" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="mb-3 flex flex-wrap gap-4 text-xs font-bold text-slate-300">
          <span className="flex items-center gap-1.5"><span className="h-4 w-4 rounded border border-slate-500 bg-slate-800" aria-hidden="true" /> Kosong</span>
          <span className="flex items-center gap-1.5"><span className="h-4 w-4 rounded border border-lime-400 bg-lime-400/20" aria-hidden="true" /> Dipilih</span>
          <span className="flex items-center gap-1.5"><span className="h-4 w-4 rounded border border-slate-800 bg-[#0f172a]" aria-hidden="true" /> Terisi / lewat</span>
          <span className="flex items-center gap-1.5"><Flame size={14} className="text-amber-300" aria-hidden="true" /> Jam emas</span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-700 bg-[#0f1a2e]">
          <table className="w-full table-fixed border-collapse text-center">
            <caption className="sr-only">Jadwal lapangan {date ? fmtTanggal(date) : ''}</caption>
            <thead>
              <tr className="border-b border-slate-700">
                <th scope="col" className="w-[4.25rem] border-r border-slate-700 py-3 text-[11px] font-bold text-slate-300 sm:w-24 sm:text-xs">JAM</th>
                {courts.map((c) => (
                  <th key={c.id} scope="col" className="border-r border-slate-700 px-1 py-2 last:border-r-0">
                    <span className="block text-[13px] font-bold sm:text-sm">{c.name}</span>
                    <span className="block text-[11px] font-normal leading-tight text-slate-300">{c.type}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((h) => {
                const Ikon = IKON[golonganJam(h)];
                return (
                  <tr key={h} className="border-b border-slate-700/60 last:border-b-0">
                    <th scope="row" className="border-r border-slate-700 py-3 font-mono text-sm font-bold text-slate-200 sm:text-base">
                      <span className="inline-flex items-center gap-1 sm:gap-1.5">{h}<Ikon size={13} className={golonganJam(h) === 'emas' ? 'text-amber-300' : 'text-slate-400'} aria-hidden="true" /></span>
                    </th>
                    {courts.map((c) => {
                      const k = key(c.id, h); const habis = !date || lewat(date, h); const booked = bookedSet.has(k); const sel = picked.includes(k);
                      const off = booked || habis;
                      return (
                        <td key={k} className="border-r border-slate-800 p-0 last:border-r-0">
                          <button type="button" disabled={off || (penuh && !sel)} onClick={() => toggle(c.id, h)} aria-pressed={sel}
                            className={`h-full min-h-11 w-full py-3 text-xs font-bold transition ${
                              sel ? 'bg-lime-400/15 text-lime-300 shadow-[inset_0_0_0_2px_#84cc16]'
                              : off ? 'cursor-not-allowed bg-[#0f172a] text-slate-500'
                              : penuh ? 'cursor-not-allowed bg-slate-800/40 text-slate-400'
                              : 'bg-slate-800/40 text-slate-200 hover:bg-lime-400/10 hover:text-lime-300'
                            }`}>
                            <span className="sr-only">{c.name} pukul {h}, </span>
                            {booked ? 'Terisi' : habis ? <><span aria-hidden="true">—</span><span className="sr-only">sudah lewat</span></> : sel ? 'Dipilih' : `${Math.round(hargaSlot(date, h) / 1000)}rb`}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {penuh && <p className="mt-2 text-sm text-amber-200">Maksimal {arena.maksSlot} jam per booking. Hapus salah satu untuk memilih jam lain.</p>}

        {picked.length > 0 && (
            <form ref={formRef} onSubmit={confirm} aria-labelledby="h-slot" className="anim-naik mt-6 scroll-mt-24 rounded-2xl border border-slate-700 bg-slate-900/70 p-5 sm:p-6">
              <div className="flex items-center justify-between"><h2 id="h-slot" className="font-bold">Slot dipilih ({picked.length})</h2><span className="font-bold text-lime-300">{rupiah(total)}</span></div>
              <ul className="mt-3 flex flex-wrap gap-2">
                {[...picked].sort().map((k) => { const [c, h] = k.split('-'); return (
                  <li key={k} className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-100">Lap {c} · {h} · {rupiah(hargaSlot(date, h))}<button type="button" onClick={() => setPicked((p) => p.filter((x) => x !== k))} aria-label={`Hapus lapangan ${c} jam ${h}`} className="-my-1 -mr-2 grid h-7 w-7 place-items-center rounded-full text-slate-300 hover:bg-slate-700 hover:text-rose-300"><X size={13} /></button></li>
                ); })}
              </ul>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800/60 px-3 py-2.5 focus-within:border-lime-400"><User size={16} className="text-slate-300" aria-hidden="true" /><span className="sr-only">Nama tim atau penyewa</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama tim / penyewa" autoComplete="name" required className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" /></label>
                <label className="flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800/60 px-3 py-2.5 focus-within:border-lime-400"><Phone size={16} className="text-slate-300" aria-hidden="true" /><span className="sr-only">Nomor HP</span><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Nomor HP" autoComplete="tel" required className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" /></label>
              </div>
              <button type="submit" className="mt-5 w-full rounded-xl bg-lime-400 py-3.5 text-sm font-bold text-slate-900 transition hover:bg-lime-300">Simpan booking · {rupiah(total)}</button>
              <p className="mt-2 text-center text-xs text-slate-300">Purwarupa: tidak ada pembayaran. Booking disimpan di peramban ini.</p>
            </form>
        )}
      </main>

      {adaPilihan && !formTerlihat && (
        <div className="anim-bawah fixed inset-x-0 bottom-0 z-30 border-t border-slate-700 bg-[#0b1220]/95 px-5 py-3 backdrop-blur sm:hidden">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
            <p className="text-sm"><span className="font-bold text-slate-100">{picked.length} slot</span> <span className="text-slate-300">·</span> <span className="font-bold text-lime-300">{rupiah(total)}</span></p>
            <button type="button" onClick={keFormulir} className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-lime-400 px-4 text-sm font-bold text-slate-900">Isi data <ArrowDown size={15} aria-hidden="true" /></button>
          </div>
        </div>
      )}

      {done && (
          <div className="anim-pudar fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5" onClick={() => setDone(null)}>
            <div ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="judul-selesai" onClick={(e) => e.stopPropagation()} className="anim-skala w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-7 text-center outline-none">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-lime-400 text-slate-900"><Check size={28} /></div>
              <h2 id="judul-selesai" className="mt-4 text-2xl font-bold">Booking tersimpan</h2>
              <p className="mt-1 text-sm text-slate-300">Kode <span className="font-mono font-semibold text-slate-100">{done.kode}</span> · {done.name}</p>
              <dl className="mt-5 space-y-1.5 rounded-xl bg-slate-800 p-4 text-left text-sm text-slate-300">
                <div className="flex justify-between gap-4"><dt>Tanggal</dt><dd className="font-semibold text-slate-100">{fmtTanggal(done.date)}</dd></div>
                <div className="flex justify-between gap-4"><dt>Slot</dt><dd className="text-right font-semibold text-slate-100">{done.slots.map((s) => `${s.courtId} ${s.hour}`).join(', ')}</dd></div>
                <div className="flex justify-between gap-4"><dt>Total</dt><dd className="font-semibold text-lime-300">{rupiah(done.total)}</dd></div>
              </dl>
              <p className="mt-4 text-xs text-slate-300">Datang 10 menit lebih awal. Ini purwarupa — tidak ada pembayaran.</p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Link href="/jadwal-saya" className="rounded-xl bg-lime-400 py-3 text-sm font-bold text-slate-900 hover:bg-lime-300">Jadwal saya</Link>
                <button type="button" onClick={() => setDone(null)} className="rounded-xl border border-slate-600 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-800">Tutup</button>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}
