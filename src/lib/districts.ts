// src/lib/districts.ts
// Simple mapping of cities to districts. Keep this file small and editable.
export const DISTRICTS_BY_CITY: Record<string, string[]> = {
  Solingen: [
    'Solingen-Mitte',
    'Ohligs',
    'Wald',
    'Gräfrath',
    'Merscheid',
    'Höhscheid',
    'Aufderhöhe',
    'Weyer',
    'Burg',
    'Dorp',
    'Stöcken',
  ],
  // Weitere Städte später hier ergänzen:
  // "Wuppertal": ["Elberfeld", "Barmen", ...],
};

export function getDistrictsForCity(city: string | null | undefined) {
  if (!city) return [];
  // Key-Normalisierung: einfacher trim; achte auf Groß-/Kleinschreibung in den Keys
  const key = city.trim();
  return DISTRICTS_BY_CITY[key] || [];
}