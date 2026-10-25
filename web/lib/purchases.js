const PURCHASES_KEY = 'myth-korean-purchases';

function readIds() {
  if (typeof window === 'undefined') return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(PURCHASES_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.map((id) => String(id)) : [];
  } catch {
    return [];
  }
}

export function readPurchases() {
  return readIds();
}

export function addPurchases(ids) {
  const next = Array.from(new Set([...readIds(), ...ids.map((id) => String(id))]));
  window.localStorage.setItem(PURCHASES_KEY, JSON.stringify(next));
}

export function clearPurchases() {
  window.localStorage.removeItem(PURCHASES_KEY);
}
