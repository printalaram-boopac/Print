/**
 * Parses a custom page-range string like "1,3,5-8" into a sorted, deduped,
 * validated list of 0-based page indices (Step 12 §5, §107).
 */
export function parsePageRange(input: string, pageCount: number): { pages: number[] } | { error: string } {
  const trimmed = input.trim();
  if (!trimmed) return { error: 'Enter at least one page number.' };

  const indices = new Set<number>();
  const parts = trimmed.split(',').map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
    const singleMatch = part.match(/^(\d+)$/);

    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      if (start < 1 || end < 1) return { error: `"${part}" isn't a valid page range.` };
      if (start > end) return { error: `"${part}" is backwards — start page must come before the end page.` };
      if (start > pageCount || end > pageCount) return { error: `"${part}" is beyond the last page (${pageCount}).` };
      for (let i = start; i <= end; i += 1) indices.add(i - 1);
    } else if (singleMatch) {
      const n = Number(singleMatch[1]);
      if (n < 1) return { error: `"${part}" isn't a valid page number.` };
      if (n > pageCount) return { error: `Page ${n} is beyond the last page (${pageCount}).` };
      indices.add(n - 1);
    } else {
      return { error: `"${part}" isn't a valid page number or range.` };
    }
  }

  if (indices.size === 0) return { error: 'Enter at least one page number.' };
  return { pages: Array.from(indices).sort((a, b) => a - b) };
}
