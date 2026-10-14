/**
 * Universal Image Path Resolver for CineRate
 * Resolves TMDB paths, absolute HTTP(S) URLs, canonical titles, and provides safe fallbacks.
 */

export const PLACEHOLDER_POSTER = 'https://via.placeholder.com/500x750?text=No+Poster+Available';
export const PLACEHOLDER_BACKDROP = 'https://via.placeholder.com/1280x720?text=No+Backdrop+Available';

export const BROKEN_POSTER_REPLACEMENTS = {
  '9w019B9K12erA324': 'https://image.tmdb.org/t/p/w500/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg',
  '8cdWjvZ211M13968': 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
  'iuFNMS8U5cb6xfzi51Dbkovj7vM': 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg'
};

export const BROKEN_BACKDROP_REPLACEMENTS = {
  '9w019B9K12erA324': 'https://image.tmdb.org/t/p/original/eG9lz41mJqsI4J6ubMtVqD26q2J.jpg',
  '8cdWjvZ211M13968': 'https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
  'iuFNMS8U5cb6xfzi51Dbkovj7vM': 'https://image.tmdb.org/t/p/original/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg'
};

export const CANONICAL_POSTERS = {
  'the wild robot': 'https://image.tmdb.org/t/p/w500/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg',
  'wild robot': 'https://image.tmdb.org/t/p/w500/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg',
  'deadpool & wolverine': 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
  'deadpool and wolverine': 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
  'deadpool wolverine': 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
  'spider-man: brand new day': 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
  'spiderman brand new day': 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
  'spider-man': 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
  'spiderman': 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
  'spider-man: no way home': 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
  'insidious': 'https://image.tmdb.org/t/p/w500/tmlDFIUpGRKiuWm9Ixc6CYDk4y0.jpg',
  'interstellar': 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  'oppenheimer': 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
  'the dark knight': 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
  'inception': 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
  'dune: part two': 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
  'the godfather': 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
  'pulp fiction': 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
  'the shawshank redemption': 'https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
  'parasite': 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
  'spirited away': 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
  'whiplash': 'https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg',
  'la la land': 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg',
  'rrr': 'https://image.tmdb.org/t/p/w500/nEufeZlyAOLqO2brrs0yeF1lgXO.jpg',
  'everything everywhere all at once': 'https://image.tmdb.org/t/p/w500/u68AjlvlutfEIcpmbYpKcdi09ut.jpg',
  'spider-man: across the spider-verse': 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
  'fight club': 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
  'gladiator': 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
  'the matrix': 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
  'avengers: endgame': 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
  'coco': 'https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg',
  'goodfellas': 'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg',
  'seven': 'https://image.tmdb.org/t/p/w500/69Sns8WoET6CfaYlIkHbla4l7nC.jpg',
  'the lord of the rings: the fellowship of the ring': 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
  'your name.': 'https://image.tmdb.org/t/p/w500/vfJFJPepRKapMd5G2ro7klIRysq.jpg',
  'your name': 'https://image.tmdb.org/t/p/w500/vfJFJPepRKapMd5G2ro7klIRysq.jpg',
  'the silence of the lambs': 'https://image.tmdb.org/t/p/w500/rplLJ2hPcOQmkFhTqUte0MkEaO2.jpg',
  'blade runner 2049': 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg'
};

export const CANONICAL_BACKDROPS = {
  'the wild robot': 'https://image.tmdb.org/t/p/original/eG9lz41mJqsI4J6ubMtVqD26q2J.jpg',
  'wild robot': 'https://image.tmdb.org/t/p/original/eG9lz41mJqsI4J6ubMtVqD26q2J.jpg',
  'deadpool & wolverine': 'https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
  'deadpool and wolverine': 'https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
  'deadpool wolverine': 'https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
  'spider-man: brand new day': 'https://image.tmdb.org/t/p/original/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg',
  'spiderman brand new day': 'https://image.tmdb.org/t/p/original/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg',
  'spider-man': 'https://image.tmdb.org/t/p/original/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg',
  'spiderman': 'https://image.tmdb.org/t/p/original/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg',
  'spider-man: no way home': 'https://image.tmdb.org/t/p/original/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg',
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
  // 1. Check known broken path replacements (including Barbie hash iuFNMS8U5cb6xfzi51Dbkovj7vM)
  if (path && typeof path === 'string') {
    for (const [brokenKey, validUrl] of Object.entries(BROKEN_POSTER_REPLACEMENTS)) {
      if (path.includes(brokenKey)) {
        return validUrl;
      }
    }
  }

  // 2. Check title against canonical catalog
  if (title && typeof title === 'string') {
    const norm = normalizeTitle(title);
    if (norm.includes('across the spider verse') || norm.includes('spider verse')) {
      return 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg';
    }
    if (norm.includes('spider man') || norm.includes('spiderman')) {
      return 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg';
    }
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
  // 1. Check known broken path replacements
  if (path && typeof path === 'string') {
    for (const [brokenKey, validUrl] of Object.entries(BROKEN_BACKDROP_REPLACEMENTS)) {
      if (path.includes(brokenKey)) {
        return validUrl;
      }
    }
  }

  // 2. Check title against canonical catalog
  if (title && typeof title === 'string') {
    const norm = normalizeTitle(title);
    if (norm.includes('across the spider verse') || norm.includes('spider verse')) {
      return 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg';
    }
    if (norm.includes('spider man') || norm.includes('spiderman')) {
      return 'https://image.tmdb.org/t/p/original/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg';
    }
    for (const [key, validUrl] of Object.entries(CANONICAL_BACKDROPS)) {
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
