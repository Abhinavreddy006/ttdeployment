import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, totalReviews, showScore = true, size = 14, scale = 10 }) => {
  const numRating = Number(rating) || 0;

  // Format score
  const displayScore = numRating > 0 ? numRating.toFixed(1) : 'NR';

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
      <Star
        size={size}
        style={{ fill: 'var(--gold-primary)', color: 'var(--gold-primary)' }}
      />
      {showScore && (
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.86rem',
          fontWeight: 700,
          color: 'var(--gold-light)'
        }}>
          {displayScore}
          <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 400 }}>/{scale}</span>
        </span>
      )}
      {totalReviews !== undefined && totalReviews > 0 && (
        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
          ({totalReviews})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
