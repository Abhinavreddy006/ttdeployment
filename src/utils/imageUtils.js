/**
 * Universal Image Path Resolver for CineRate
 * Resolves TMDB paths, absolute HTTP(S) URLs, canonical titles, and provides safe fallbacks.
 */

export const PLACEHOLDER_POSTER = 'https://via.placeholder.com/500x750?text=No+Poster+Available';
export const PLACEHOLDER_BACKDROP = 'https://via.placeholder.com/1280x720?text=No+Backdrop+Available';

export const BROKEN_PATH_REPLACEMENTS = {
  '9w019B9K12erA324': 'https://image.tmdb.org/t/p/w500/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg',
  '8cdWjvZ211M13968': 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg'
};

export const CANONICAL_POSTERS = {
  'the wild robot': 'https://image.tmdb.org/t/p/w500/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg',
  'wild robot': 'https://image.tmdb.org/t/p/w500/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg',
  'deadpool & wolverine': 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
  'deadpool and wolverine': 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
  'deadpool wolverine': 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
  'spider-man: brand new day': 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
  'spiderman brand new day': 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
  'insidious': 'https://image.tmdb.org/t/p/w500/tmlDFIUpGRKiuWm9Ixc6CYDk4y0.jpg',
  'interstellar': 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  'oppenheimer': 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
  'the dark knight': 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
  'inception': 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
  'dune: part two': 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg'
};

export const CANONICAL_BACKDROPS = {
  'the wild robot': 'https://image.tmdb.org/t/p/original/eG9lz41mJqsI4J6ubMtVqD26q2J.jpg',
  'wild robot': 'https://image.tmdb.org/t/p/original/eG9lz41mJqsI4J6ubMtVqD26q2J.jpg',
  'deadpool & wolverine': 'https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
  'deadpool and wolverine': 'https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
  'deadpool wolverine': 'https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
  'spider-man: brand new day': 'https://image.tmdb.org/t/p/original/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
  'insidious': 'https://image.tmdb.org/t/p/original/tmlDFIUpGRKiuWm9Ixc6CYDk4y0.jpg',
  'interstellar': 'https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  'oppenheimer': 'https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
  'the dark knight': 'https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
  'inception': 'https://image.tmdb.org/t/p/original/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
  'dune: part two': 'https://image.tmdb.org/t/p/original/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg'
};

const normalizeTitle = (title) => {
  return String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
};

export const getPosterUrl = (path, title) => {
  // 1. Check known broken path replacements (e.g. dummy mock paths)
  if (path && typeof path === 'string') {
    for (const [brokenKey, validUrl] of Object.entries(BROKEN_PATH_REPLACEMENTS)) {
      if (path.includes(brokenKey)) {
        return validUrl;
      }
    }
  }

  // 2. Check title against canonical catalog
  if (title && typeof title === 'string') {
    const norm = normalizeTitle(title);
    for (const [key, validUrl] of Object.entries(CANONICAL_POSTERS)) {
      const normKey = normalizeTitle(key);
      if (norm === normKey || norm.includes(normKey) || normKey.includes(norm)) {
        return validUrl;
      }
    }
  }

  // 3. Fallback check if path is missing
  if (!path || path === 'null' || path === 'undefined' || typeof path !== 'string' || !path.trim()) {
    if (title && typeof title === 'string') {
      const norm = normalizeTitle(title);
      for (const [key, validUrl] of Object.entries(CANONICAL_POSTERS)) {
        const normKey = normalizeTitle(key);
        if (norm === normKey || norm.includes(normKey) || normKey.includes(norm)) {
          return validUrl;
        }
      }
    }
    return PLACEHOLDER_POSTER;
  }

  const cleanStr = path.trim();
  if (cleanStr.startsWith('http://') || cleanStr.startsWith('https://')) {
    return cleanStr;
  }
  const cleanPath = cleanStr.startsWith('/') ? cleanStr : `/${cleanStr}`;
  return `https://image.tmdb.org/t/p/w500${cleanPath}`;
};

export const getBackdropUrl = (path, title) => {
  // 1. Check title against canonical catalog
  if (title && typeof title === 'string') {
    const norm = normalizeTitle(title);
    for (const [key, validUrl] of Object.entries(CANONICAL_BACKDROPS)) {
      const normKey = normalizeTitle(key);
      if (norm === normKey || norm.includes(normKey) || normKey.includes(norm)) {
        return validUrl;
      }
    }
  }

  // 2. Fallback check if path is missing
  if (!path || path === 'null' || path === 'undefined' || typeof path !== 'string' || !path.trim()) {
    if (title && typeof title === 'string') {
      const norm = normalizeTitle(title);
      for (const [key, validUrl] of Object.entries(CANONICAL_BACKDROPS)) {
        const normKey = normalizeTitle(key);
        if (norm === normKey || norm.includes(normKey) || normKey.includes(norm)) {
          return validUrl;
        }
      }
    }
    return PLACEHOLDER_BACKDROP;
  }

  const cleanStr = path.trim();
  if (cleanStr.startsWith('http://') || cleanStr.startsWith('https://')) {
    return cleanStr;
  }
  const cleanPath = cleanStr.startsWith('/') ? cleanStr : `/${cleanStr}`;
  return `https://image.tmdb.org/t/p/original${cleanPath}`;
};
