const CDN_BASE = 'https://cdn.jsdelivr.net/gh/printalaram-boopac/Print@main/frontend/public/';

export function asset(path: string): string {
  return `${CDN_BASE}${path.replace(/^\//, '')}`;
}
