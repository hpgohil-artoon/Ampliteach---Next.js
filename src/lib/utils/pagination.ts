export function totalPages(totalItems: number, perPage: number): number {
  return Math.max(1, Math.ceil(totalItems / perPage));
}

export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}

/**
 * Page numbers to render, collapsing long runs with `null` (an ellipsis).
 * e.g. 1 … 4 5 6 … 12
 */
export function pageRange(current: number, total: number, siblings = 1): (number | null)[] {
  const pages = new Set<number>([1, total]);
  for (let i = current - siblings; i <= current + siblings; i++) {
    if (i > 1 && i < total) pages.add(i);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | null)[] = [];

  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) out.push(null);
    out.push(page);
  });

  return out;
}
