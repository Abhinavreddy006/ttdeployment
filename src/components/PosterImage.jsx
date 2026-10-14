import React, { useEffect, useRef, useState } from 'react';
import { Film } from 'lucide-react';
import { tmdbService } from '../services/api';

const posterLookups = new Map();

const getPosterByTitle = (title, year) => {
  const key = `${String(title || '').trim().toLowerCase()}|${year || ''}`;
  if (!key || key.startsWith('|')) return Promise.resolve('');

  if (!posterLookups.has(key)) {
    const lookup = tmdbService.getPosterByTitle(title, year).catch(error => {
      console.error(`Unable to find a matching poster for "${title}".`, error);
      return '';
    });
    posterLookups.set(key, lookup);
  }
  return posterLookups.get(key);
};

export const retryPosterLookups = () => {
  posterLookups.clear();
  tmdbService.clearPosterLookupCache();
  window.dispatchEvent(new Event('cinerate:retry-posters'));
};

export const getPosterUrl = (path, size = 'w500') => {
  if (typeof path !== 'string' || !path.trim()) return '';

  const normalizedPath = path.trim();
  if (normalizedPath.includes('iuFNMS8U5cb6xfzi51Dbkovj7vM')) {
    return 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg';
  }
  if (normalizedPath.includes('9w019B9K12erA324')) {
    return 'https://image.tmdb.org/t/p/w500/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg';
  }
  if (normalizedPath.includes('8cdWjvZ211M13968')) {
    return 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg';
  }
  if (/^https?:\/\//i.test(normalizedPath)) return normalizedPath;
  if (normalizedPath.startsWith('/')) {
    return `https://image.tmdb.org/t/p/${size}${normalizedPath}`;
  }
  return `https://image.tmdb.org/t/p/${size}/${normalizedPath}`;
};

const CANONICAL_POSTERS = {
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
  'spirited away': 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
  'parasite': 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
  'the shawshank redemption': 'https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
  'pulp fiction': 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
  'the godfather': 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
  'spider-man: across the spider-verse': 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
  'whiplash': 'https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg',
  'la la land': 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg',
  'rrr': 'https://image.tmdb.org/t/p/w500/nEufeZlyAOLqO2brrs0yeF1lgXO.jpg',
  'everything everywhere all at once': 'https://image.tmdb.org/t/p/w500/u68AjlvlutfEIcpmbYpKcdi09ut.jpg',
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

const getCanonicalPoster = (title) => {
  if (!title) return '';
  const key = String(title).toLowerCase().trim();
  if (key.includes('across the spider-verse') || key.includes('across the spider verse')) {
    return 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg';
  }
  if (key.includes('spider-man') || key.includes('spiderman')) {
    return 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg';
  }
  return CANONICAL_POSTERS[key] || '';
};

const PosterImage = ({
  src,
  alt,
  className = '',
  aspectRatio = '2/3',
  size = 'w500',
  releaseYear,
  lookupByTitle = true
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const lookupAttempted = useRef(false);
  const imgRef = useRef(null);

  const directUrl = getPosterUrl(src, size);
  const canonicalUrl = getCanonicalPoster(alt);

  useEffect(() => {
    let active = true;
    lookupAttempted.current = false;
    setHasError(false);
    setIsLoaded(false);

    if (canonicalUrl && (String(alt || '').toLowerCase().includes('spider-man: brand new day') || String(alt || '').toLowerCase().includes('spiderman brand new day'))) {
      setImageUrl(canonicalUrl);
    } else if (canonicalUrl && String(alt || '').toLowerCase().includes('across the spider-verse')) {
      setImageUrl(canonicalUrl);
    } else if (directUrl) {
      setImageUrl(directUrl);
    } else if (canonicalUrl) {
      setImageUrl(canonicalUrl);
    } else if (alt && lookupByTitle) {
      lookupAttempted.current = true;
      getPosterByTitle(alt, releaseYear).then(url => {
        if (!active) return;
        if (url) {
          setImageUrl(url);
        } else {
          setHasError(true);
        }
      });
    } else {
      setHasError(true);
    }

    return () => {
      active = false;
    };
  }, [src, directUrl, canonicalUrl, alt, releaseYear, lookupByTitle]);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [imageUrl]);

  const handleImageError = () => {
    setIsLoaded(false);
    if (canonicalUrl && imageUrl !== canonicalUrl) {
      setImageUrl(canonicalUrl);
      return;
    }
    if (!lookupAttempted.current && alt) {
      lookupAttempted.current = true;
      getPosterByTitle(alt, releaseYear).then(url => {
        if (url && url !== imageUrl) {
          setImageUrl(url);
        } else {
          setHasError(true);
        }
      });
    } else {
      setHasError(true);
    }
  };

  if (hasError || !imageUrl) {
    const title = alt || 'Featured Film';
    const hash = Array.from(title).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hues = [
      'linear-gradient(145deg, #1f1435 0%, #0d0a17 100%)',
      'linear-gradient(145deg, #1b263b 0%, #0b1320 100%)',
      'linear-gradient(145deg, #2b1b17 0%, #140b08 100%)',
      'linear-gradient(145deg, #172a23 0%, #08140f 100%)',
      'linear-gradient(145deg, #261730 0%, #110817 100%)'
    ];
    const bgGradient = hues[hash % hues.length];

    return (
      <div
        className={`poster-placeholder ${className}`}
        role="img"
        aria-label={`${title} poster`}
        style={{
          width: '100%',
          aspectRatio,
          background: bgGradient,
          border: '1px solid rgba(167, 139, 250, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.2rem 0.8rem',
          textAlign: 'center',
          color: '#f8fafc',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.6)'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #a855f7, #6366f1)'
        }} />
        <span style={{
          fontSize: '0.62rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#a78bfa',
          fontWeight: 750
        }}>
          CINERATE SELECTION
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', margin: 'auto 0' }}>
          <Film size={28} style={{ color: '#c084fc', opacity: 0.85 }} />
          <h4 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: '1.25',
            margin: '0.2rem 0 0',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {title}
          </h4>
        </div>
        {releaseYear && (
          <span style={{
            fontSize: '0.68rem',
            padding: '0.2rem 0.55rem',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '4px',
            color: '#cbd5e1',
            letterSpacing: '0.05em'
          }}>
            {releaseYear}
          </span>
        )}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio, overflow: 'hidden', backgroundColor: '#070a10' }}>
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#0d1422',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 0
        }}>
          <Film size={22} style={{ color: 'var(--text-subtle)', opacity: 0.35 }} />
        </div>
      )}
      <img
        ref={imgRef}
        src={imageUrl}
        alt={`${alt || 'Movie'} poster`}
        className={className}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={handleImageError}
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.25s ease, transform 0.35s ease'
        }}
      />
    </div>
  );
};

export default PosterImage;
