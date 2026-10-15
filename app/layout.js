import './globals.css';
import { Outfit } from 'next/font/google';
import Kepala from '@/components/Kepala';
import Kaki from '@/components/Kaki';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });

const __jsonld = {"@context":"https://schema.org","@type":"WebSite","name":"Gelanggang Petang","description":"Booking lapangan futsal lewat grid jam × lapangan: harga sore, jam emas, dan malam terlihat di tiap kotak. Plus papan cari lawan untuk sparring.","url":"https://reservasi-futsal.pintuweb.id","inLanguage":"id"};

export const metadata = {
  metadataBase: new URL("https://reservasi-futsal.pintuweb.id"),
  title: { default: "Gelanggang Petang — Booking lapangan futsal", template: "%s — Gelanggang Petang" },
  description: "Booking lapangan futsal lewat grid jam × lapangan: harga sore, jam emas, dan malam terlihat di tiap kotak. Plus papan cari lawan untuk sparring.",
  applicationName: "Gelanggang Petang",
  keywords: ["booking lapangan futsal", "sewa lapangan futsal", "jadwal futsal", "cari lawan sparring"],
  authors: [{ name: "Gelanggang Petang" }],
  creator: "Gelanggang Petang",
  publisher: "Gelanggang Petang",
  alternates: { canonical: "https://reservasi-futsal.pintuweb.id" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://reservasi-futsal.pintuweb.id",
    siteName: "Gelanggang Petang",
    title: "Gelanggang Petang — Booking lapangan futsal",
    description: "Booking lapangan futsal lewat grid jam × lapangan: harga sore, jam emas, dan malam terlihat di tiap kotak. Plus papan cari lawan untuk sparring.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Gelanggang Petang — Booking lapangan futsal" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gelanggang Petang — Booking lapangan futsal",
    description: "Booking lapangan futsal lewat grid jam × lapangan: harga sore, jam emas, dan malam terlihat di tiap kotak. Plus papan cari lawan untuk sparring.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const viewport = { themeColor: '#84cc16' };

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={outfit.variable}>
      <body className="antialiased">
        <Kepala />
        {children}
        <Kaki />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(__jsonld) }} />
        <aside aria-label="Tentang situs demo ini" style={{ display: 'block', margin: 0, padding: '12px 16px', background: '#0f1b33', color: '#dfe6f3', font: '400 13px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', textAlign: 'center' }}>
          Situs demo buatan PintuWeb — nama dan isinya rekaan.{' '}
          <a href="https://www.pintuweb.id/kontak?demo=futsal" style={{ color: '#ffffff', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>Buat yang seperti ini →</a>
        </aside>
        </body>
    </html>
  );
}
