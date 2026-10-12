/**
 * Universal Image Path Resolver for CineRate
 * Resolves TMDB paths, absolute HTTP(S) URLs, and provides safe fallbacks.
 */

export const PLACEHOLDER_POSTER = 'https://via.placeholder.com/500x750?text=No+Poster+Available';
export const PLACEHOLDER_BACKDROP = 'https://via.placeholder.com/1280x720?text=No+Backdrop+Available';

export const getPosterUrl = (path) => {
  if (!path || path === 'null' || path === 'undefined' || typeof path !== 'string' || !path.trim()) {
    return 'https://via.placeholder.com/500x750?text=No+Poster+Available';
  }
  const cleanStr = path.trim();
  if (cleanStr.startsWith('http://') || cleanStr.startsWith('https://')) {
    return cleanStr;
  }
  const cleanPath = cleanStr.startsWith('/') ? cleanStr : `/${cleanStr}`;
  return `https://image.tmdb.org/t/p/w500${cleanPath}`;
};

export const getBackdropUrl = (path) => {
  if (!path || path === 'null' || path === 'undefined' || typeof path !== 'string' || !path.trim()) {
    return 'https://via.placeholder.com/1280x720?text=No+Backdrop+Available';
  }
  const cleanStr = path.trim();
  if (cleanStr.startsWith('http://') || cleanStr.startsWith('https://')) {
    return cleanStr;
  }
  const cleanPath = cleanStr.startsWith('/') ? cleanStr : `/${cleanStr}`;
  return `https://image.tmdb.org/t/p/original${cleanPath}`;
};
