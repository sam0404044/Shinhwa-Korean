export function assetPath(path) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}
