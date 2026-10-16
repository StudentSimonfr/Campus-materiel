// Accès sécurisé à localStorage : ne lance jamais d'exception vers l'interface.
export interface LoadResult<T> { found: boolean; value: T | null; error: boolean }

export function load<T>(key: string): LoadResult<T> {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return { found: false, value: null, error: false };
    return { found: true, value: JSON.parse(raw) as T, error: false };
  } catch {
    return { found: false, value: null, error: true }; // lecture impossible ou JSON corrompu
  }
}

export function save(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false; // quota dépassé, mode privé, etc.
  }
}

export function remove(key: string): void {
  try { localStorage.removeItem(key); } catch { /* ignoré */ }
}

export const newUuid = (): string =>
  globalThis.crypto?.randomUUID?.() ?? `res-${Date.now()}-${Math.random().toString(16).slice(2)}`;
