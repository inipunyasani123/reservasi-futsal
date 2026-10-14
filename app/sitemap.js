const URL = 'https://reservasi-futsal.pintuweb.id';

export default function sitemap() {
  const now = new Date();
  return ['', '/harga', '/sparring'].map((p) => ({ url: URL + p, lastModified: now, changeFrequency: 'weekly', priority: p ? 0.7 : 1 }));
}
