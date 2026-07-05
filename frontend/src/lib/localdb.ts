// ─────────────────────────────────────────────────────────────────────────────
// 17-Maktab — to'liq statik (backendsiz) ma'lumotlar bazasi.
// Barcha ma'lumotlar brauzerning localStorage'ida saqlanadi.
// ─────────────────────────────────────────────────────────────────────────────

const PREFIX = 'skl17:';

function safeParse<T>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Bir marta "seed" (boshlang'ich) qiymat bilan to'ldiradi, keyin doim saqlangan holatni qaytaradi. */
export function readSeeded<T>(key: string, seed: T): T {
  const raw = localStorage.getItem(PREFIX + key);
  if (raw === null) {
    localStorage.setItem(PREFIX + key, JSON.stringify(seed));
    return seed;
  }
  return safeParse<T>(raw, seed);
}

export function write<T>(key: string, value: T): void {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export function nextId(items: { id: number }[]): number {
  return items.reduce((max, i) => Math.max(max, i.id), 0) + 1;
}

/** UI'da haqiqiy tarmoq so'rovi hissini berish uchun kichik sun'iy kechikish. */
export function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function nowIso(): string {
  return new Date().toISOString();
}

/** Fayl (masalan rasm)ni base64 data-URL'ga aylantiradi — backend shart emas. */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Faylni o\'qib bo\'lmadi'));
    reader.readAsDataURL(file);
  });
}
