import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { watchlistService } from '../services/api';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { Bookmark, ArrowRight } from 'lucide-react';

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [removingTmdbId, setRemovingTmdbId] = useState(null);

  const fetchWatchlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await watchlistService.getWatchlist();
      setWatchlist(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleRemove = async (e, tmdbId) => {
    e.preventDefault();
    e.stopPropagation();
    if (removingTmdbId !== null) return;
    setRemovingTmdbId(tmdbId);
    setActionError(null);
    try {
      await watchlistService.removeFromWatchlist(tmdbId);
      setWatchlist(prev => prev.filter(item => (item.tmdbId !== tmdbId && item.id !== tmdbId && item.movieId !== tmdbId)));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setRemovingTmdbId(null);
    }
  };

  return (
    <div className="watchlist-page fade-in" style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '2.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1.25rem'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: 'var(--gold-light)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              <Bookmark size={15} /> Personal Archive
            </div>
            <h1 style={{ fontSize: '2.75rem', color: 'var(--text-ivory)' }}>
              My Watchlist
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem' }}>
              Your curated queue of films saved for future viewing.
            </p>
          </div>

          {actionError && <ErrorAlert message={actionError} />}

          <span style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            {watchlist.length} {watchlist.length === 1 ? 'film' : 'films'}
          </span>
        </div>

        {/* Loading state */}
        {loading && <LoadingSpinner message="Retrieving your personal watchlist..." />}

        {/* Error state */}
        {error && <ErrorAlert message={error} onRetry={fetchWatchlist} />}

        {/* Empty state */}
        {!loading && !error && watchlist.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px dashed var(--border-medium)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '560px',
            margin: '2rem auto'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              border: '1px solid var(--border-gold)'
            }}>
              <Bookmark size={28} style={{ color: 'var(--gold-primary)' }} />
            </div>
            <h3 style={{ fontSize: '1.45rem', marginBottom: '0.65rem', color: 'var(--text-ivory)' }}>
              Your Watchlist is Empty
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
              Browse popular releases, regional spotlights, or use Find My Film to bookmark cinema you want to watch.
            </p>
            <Link to="/explore" className="btn btn-gold btn-sm">
              Explore Films <ArrowRight size={15} />
            </Link>
          </div>
        )}

        {/* Watchlist Grid */}
        {!loading && !error && watchlist.length > 0 && (
          <div className="movie-grid">
            {watchlist.map(item => (
              <MovieCard
                key={item.id || item.tmdbId}
                movie={{
                  id: item.movieId || item.tmdbId,
                  title: item.title,
                  posterUrl: item.posterUrl,
                  genre: item.genre,
                  releaseYear: item.releaseYear,
                  averageRating: item.voteAverage,
                  totalReviews: item.totalReviews,
                  language: item.language
                }}
                onRemove={(event, tmdbId) => handleRemove(event, tmdbId)}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default WatchlistPage;
