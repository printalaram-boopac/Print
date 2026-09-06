/** Sanitized, kebab-case file name from a project name (Step 12 §57). */
export function sanitizeFileName(name: string): string {
  const cleaned = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return cleaned || 'untitled-magazine';
}

export function pagedFileName(baseName: string, pageNumber: number, totalPages: number, extension: string): string {
  const width = String(totalPages).length < 2 ? 2 : String(totalPages).length;
  const padded = String(pageNumber).padStart(width, '0');
  return `${baseName}-page-${padded}.${extension}`;
}
