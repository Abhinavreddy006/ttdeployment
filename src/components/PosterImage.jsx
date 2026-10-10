import React, { useState } from 'react';
import { Film } from 'lucide-react';
import { getImageUrl } from '../services/api';

const PosterImage = ({ src, alt, className = '', aspectRatio = '2/3', size = 'w500' }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const fullUrl = src ? getImageUrl(src, size) : '';

  if (!fullUrl || hasError) {
    return (
      <div
        className={`poster-placeholder ${className}`}
        style={{
          width: '100%',
          aspectRatio,
          backgroundColor: '#0a0e16',
          backgroundImage: 'linear-gradient(145deg, #0d1422 0%, #070a10 100%)',
          border: '1px solid rgba(247, 244, 236, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          textAlign: 'center',
          color: 'var(--text-muted)'
        }}
      >
        <Film size={32} style={{ color: 'var(--gold-primary)', opacity: 0.65, marginBottom: '0.5rem' }} />
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.85rem',
          color: 'var(--text-ivory-dim)',
          lineHeight: '1.3',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {alt || 'CineRate Feature'}
        </span>
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
          justifyContent: 'center'
        }}>
          <Film size={22} style={{ color: 'var(--text-subtle)', opacity: 0.35 }} />
        </div>
      )}
      <img
        src={fullUrl}
        alt={alt}
        className={className}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: isLoaded ? 'block' : 'none',
          transition: 'transform 0.35s ease'
        }}
      />
    </div>
  );
};

export default PosterImage;
