import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tmdbService, reviewService, watchlistService, movieService, getImageUrl } from '../services/api';
import { getPosterUrl, getBackdropUrl } from '../utils/imageUtils';
import PosterImage from '../components/PosterImage';
import RatingStars from '../components/RatingStars';
import MovieCard from '../components/MovieCard';
import ReviewModal from '../components/ReviewModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Globe,
  Bookmark,
  Star,
  Play,
  MessageSquare,
  Check,
  Share2,
  User,
  Film,
  Sparkles
} from 'lucide-react';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistStatusKnown, setWatchlistStatusKnown] = useState(false);
  const [watchlistBusy, setWatchlistBusy] = useState(false);
  const [watchlistError, setWatchlistError] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchReviews = async () => {
    setReviewLoading(true);
    setReviewError(null);
    try {
      const communityReviews = await reviewService.getReviews(id);
      setReviews(communityReviews);
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  const fetchMovieData = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      try {
        data = await tmdbService.getMovieDetails(id);
      } catch (tmdbErr) {
        // Fallback to local Spring Boot database movie by ID or TMDB ID
        const local = await movieService.getMovieById(id);
        if (local && (local.title || local.id)) {
          data = {
            ...local,
            id: local.tmdbId || local.id,
            tmdbId: local.tmdbId || local.id,
            title: local.title,
            overview: local.description || local.overview || 'A feature film in your personal collection.',
            poster_path: local.posterUrl || local.posterPath || local.poster_path,
            backdrop_path: local.backdropUrl || local.backdropPath || local.backdrop_path || local.posterUrl,
            vote_average: local.averageRating ?? local.vote_average ?? 8.0,
            vote_count: local.totalReviews ?? local.vote_count ?? 150,
            release_date: local.releaseYear ? `${local.releaseYear}-01-01` : (local.release_date || ''),
            genres: (local.genre || 'Cinema').split(',').map((g, idx) => ({ id: idx, name: g.trim() })),
            isLocalCatalog: true
          };
        } else {
          throw tmdbErr;
        }
      }

      setMovie(data);
      setWatchlistStatusKnown(false);
      setWatchlistError(null);
      setLoading(false);

      void watchlistService.checkWatchlist(data.id || id)
        .then((inWatchlistResult) => {
          setInWatchlist(inWatchlistResult);
          setWatchlistStatusKnown(true);
        })
        .catch((watchlistRequestError) => {
          setWatchlistError(watchlistRequestError.message);
        });
      void fetchReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleWatchlistToggle = async () => {
    if (!movie || !watchlistStatusKnown || watchlistBusy) return;
    setWatchlistBusy(true);
    setWatchlistError(null);
    try {
      if (inWatchlist) {
        await watchlistService.removeFromWatchlist(movie.id);
        setInWatchlist(false);
      } else {
        await watchlistService.addToWatchlist(movie);
        setInWatchlist(true);
      }
    } catch (err) {
      setWatchlistError(err.message);
    } finally {
      setWatchlistBusy(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div style={{ padding: '6rem 0' }}>
        <LoadingSpinner message="Consulting movie archives..." />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Return Back
        </button>
        <ErrorAlert message={error || 'Movie could not be loaded.'} onRetry={fetchMovieData} />
      </div>
    );
  }

  // Extract credits
  const director = movie.credits?.crew?.find(c => c.job === 'Director')?.name || '';
  const topCast = movie.credits?.cast?.slice(0, 8) || [];
  const similarMovies = movie.similar?.results?.slice(0, 5) || [];
  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const photos = movie.images?.backdrops?.slice(0, 4) || [];

  const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : '';
  const runtimeHours = movie.runtime ? Math.floor(movie.runtime / 60) : 0;
  const runtimeMins = movie.runtime ? (movie.runtime % 60) : 0;

  return (
    <div className="movie-details-page fade-in" style={{ paddingBottom: '6rem' }}>

      {/* Immersive Backdrop Banner (Inspired by Oppenheimer UI) */}
      <section className="movie-details-hero" style={{
        position: 'relative',
        minHeight: '480px',
        backgroundColor: '#070a10',
        backgroundImage: (movie.backdrop_path || movie.backdropPath || movie.backdropUrl)
          ? `url(${getBackdropUrl(movie.backdrop_path || movie.backdropPath || movie.backdropUrl)})`
          : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center 25%',
        display: 'flex',
        alignItems: 'flex-end',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        {/* Layered gradients */}
        <div className="movie-details-shade" style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(6, 6, 16, 0.3) 0%, rgba(7, 7, 17, 0.74) 69%, #080812 100%), linear-gradient(90deg, rgba(7, 7, 17, 0.82) 0%, rgba(8, 8, 18, 0.42) 100%)'
        }} />

        <div className="container" style={{ padding: '3.5rem 1.5rem 2.5rem 1.5rem', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <ArrowLeft size={15} /> Back
            </button>

            <button
              onClick={handleShare}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              {copied ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Share2 size={14} />}
              {copied ? 'Link Copied' : 'Share'}
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '240px 1fr',
            gap: '2.5rem',
            alignItems: 'flex-end'
          }} className="details-header-grid">

            {/* Poster */}
            <div className="details-poster-frame" style={{
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg), 0 0 30px rgba(0, 0, 0, 0.8)',
              border: '1px solid var(--border-medium)',
              width: '100%',
              aspectRatio: '2/3'
            }}>
              <img
                src={getPosterUrl(movie.poster_path || movie.posterPath || movie.posterUrl || movie.imageUrl || movie.image_url)}
                alt={movie.title || movie.name || 'Movie Poster'}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster+Available';
                }}
              />
            </div>

            {/* Title & Metadata */}
            <div>
              <div className="details-metadata" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {movie.genres?.map(g => (
                  <span key={g.id} className="badge badge-gold">{g.name}</span>
                ))}
                {releaseYear && (
                  <span className="badge"><Calendar size={11} /> {releaseYear}</span>
                )}
                {movie.runtime > 0 && (
                  <span className="badge"><Clock size={11} /> {runtimeHours}h {runtimeMins}m</span>
                )}
                {movie.original_language && (
                  <span className="badge"><Globe size={11} /> {movie.original_language.toUpperCase()}</span>
                )}
              </div>

              <h1 style={{
                fontSize: '3rem',
                lineHeight: '1.15',
                color: 'var(--text-ivory)',
                marginBottom: '0.65rem'
              }}>
                {movie.title}
              </h1>

              {movie.tagline && (
                <p style={{
                  fontStyle: 'italic',
                  color: 'var(--gold-light)',
                  fontSize: '1.05rem',
                  marginBottom: '1rem',
                  fontFamily: 'var(--font-serif)'
                }}>
                  "{movie.tagline}"
                </p>
              )}

              {director && (
                <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <User size={16} style={{ color: 'var(--gold-primary)' }} />
                  Directed by <strong style={{ color: 'var(--text-ivory)' }}>{director}</strong>
                </div>
              )}

              {/* Action Buttons */}
              <div className="details-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center' }}>
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="btn btn-gold btn-sm"
                >
                  <Star size={16} fill="currentColor" /> Rate & Review
                </button>

                <button
                  onClick={handleWatchlistToggle}
                  className={`btn btn-sm ${inWatchlist ? 'btn-primary' : 'btn-outline'}`}
                  disabled={!watchlistStatusKnown || watchlistBusy}
                >
                  {watchlistBusy ? 'Saving...' : !watchlistStatusKnown ? 'Checking Watchlist...' : inWatchlist ? (
                    <><Check size={16} /> In Watchlist</>
                  ) : (
                    <><Bookmark size={16} /> Add to Watchlist</>
                  )}
                </button>

                {trailer && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <Play size={15} /> Watch Trailer
                  </a>
                )}
              </div>
              {watchlistError && (
                <p className="home-action-error" role="alert">{watchlistError}</p>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Main Details Body */}
      <div className="container" style={{ padding: '3.5rem 1.5rem' }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '3.5rem'
        }} className="details-body-grid">

          {/* Left Column: Synopsis, Cast, Photos, Community Reviews */}
          <div>

            {/* Synopsis */}
            <section className="details-synopsis" style={{ marginBottom: '3.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.85rem', color: 'var(--text-ivory)' }}>
                Synopsis
              </h2>
              <p style={{
                fontSize: '1.05rem',
                lineHeight: '1.8',
                color: 'var(--text-ivory-dim)'
              }}>
                {movie.overview || 'No synopsis recorded for this title.'}
              </p>
            </section>

            {/* Top Cast (Inspired by Oppenheimer UI) */}
            {topCast.length > 0 && (
              <section style={{ marginBottom: '3.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '1.25rem', color: 'var(--text-ivory)' }}>
                  Top Cast
                </h2>
                <div className="cast-grid">
                  {topCast.map(actor => (
                    <div key={actor.id} className="cast-card">
                      <img
                        src={getImageUrl(actor.profile_path, 'w185') || 'https://via.placeholder.com/150'}
                        alt={actor.name}
                        className="cast-avatar-img"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                      />
                      <div className="cast-name">{actor.name}</div>
                      <div className="cast-character">{actor.character || 'Cast'}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Still Frames / Photos */}
            {photos.length > 0 && (
              <section style={{ marginBottom: '3.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '1.25rem', color: 'var(--text-ivory)' }}>
                  Cinematic Stills
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1rem'
                }}>
                  {photos.map((photo, idx) => (
                    <div key={idx} style={{
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      aspectRatio: '16/9',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <img
                        src={getImageUrl(photo.file_path, 'w780')}
                        alt={`${movie.title} Still ${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Community Reviews Section (Persisted in MySQL) */}
            <section style={{ marginBottom: '3.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '0.75rem'
              }}>
                <h2 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-ivory)' }}>
                  <MessageSquare size={22} style={{ color: 'var(--gold-primary)' }} />
                  Audience Reviews ({reviews.length})
                </h2>
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="btn btn-outline btn-sm"
                >
                  Write Review
                </button>
              </div>

              {reviewError ? (
                <ErrorAlert message={reviewError} onRetry={fetchReviews} />
              ) : reviewLoading ? (
                <p className="home-empty-message">Loading community reviews...</p>
              ) : reviews.length === 0 ? (
                <div style={{
                  padding: '2.5rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px dashed var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-muted)'
                }}>
                  <p style={{ fontSize: '1rem', color: 'var(--text-ivory-dim)', marginBottom: '0.5rem' }}>
                    No reviews published yet for <em>{movie.title}</em>.
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '1.25rem' }}>
                    Be the first film lover to share your perspective!
                  </p>
                  <button onClick={() => setIsReviewModalOpen(true)} className="btn btn-gold btn-sm">
                    Write First Review
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {reviews.map(rev => (
                    <div
                      key={rev.id}
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.35rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-ivory)', fontSize: '0.98rem' }}>
                            {rev.authorName}
                          </div>
                          {rev.moodTag && (
                            <span className="badge badge-gold" style={{ marginTop: '0.25rem' }}>
                              Felt: {rev.moodTag}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--gold-light)', fontWeight: 700 }}>
                          <Star size={15} fill="currentColor" /> {rev.rating} / 10
                        </div>
                      </div>
                      <p style={{ fontSize: '0.94rem', color: 'var(--text-ivory-dim)', lineHeight: '1.6', marginTop: '0.65rem' }}>
                        {rev.content}
                      </p>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.75rem' }}>
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>

          {/* Right Column: Score Breakdown, Film Specs, and Similar */}
          <div>

            {/* Ratings Overview Card */}
            <div className="details-rating-overview" style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              marginBottom: '2rem',
              boxShadow: 'var(--shadow-md)'
            }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--text-ivory)' }}>
                Rating Overview
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>TMDB SCORE</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                    ★ {(movie.vote_average || 0).toFixed(1)}
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-subtle)' }}> / 10</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>VOTES</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-ivory)' }}>
                    {movie.vote_count?.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.85rem',
                color: 'var(--text-muted)'
              }}>
                <span>CineRate Community:</span>
                <strong style={{ color: 'var(--text-ivory)' }}>
                  {reviews.length > 0
                    ? `${(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)} / 10 (${reviews.length})`
                    : reviewError
                      ? 'Unavailable'
                      : reviewLoading
                        ? 'Loading...'
                        : 'Awaiting Reviews'}
                </strong>
              </div>
            </div>

            {/* Film Technical Specs */}
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--text-ivory)' }}>
                Film Details
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>Status</span>
                  <span style={{ color: 'var(--text-ivory)' }}>{movie.status || 'Released'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>Original Language</span>
                  <span style={{ color: 'var(--text-ivory)' }}>{(movie.original_language || '').toUpperCase()}</span>
                </div>
                {movie.budget > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-subtle)' }}>Budget</span>
                    <span style={{ color: 'var(--text-ivory)' }}>${(movie.budget / 1_000_000).toFixed(1)}M</span>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-subtle)' }}>Box Office</span>
                    <span style={{ color: 'var(--text-ivory)' }}>${(movie.revenue / 1_000_000).toFixed(1)}M</span>
                  </div>
                )}
              </div>
            </div>

            {/* Similar Movies */}
            {similarMovies.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--text-ivory)' }}>
                  Similar Films
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {similarMovies.slice(0, 3).map(sim => (
                    <Link
                      key={sim.id}
                      to={`/movies/${sim.id}`}
                      style={{
                        display: 'flex',
                        gap: '0.85rem',
                        alignItems: 'center',
                        padding: '0.5rem',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        textDecoration: 'none'
                      }}
                    >
                      <img
                        src={getPosterUrl(sim.poster_path || sim.posterPath || sim.posterUrl)}
                        alt={sim.title || sim.name || 'Movie Poster'}
                        style={{ width: '45px', height: '64px', objectFit: 'cover', borderRadius: '4px' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster+Available';
                        }}
                      />
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-ivory)', marginBottom: '0.2rem' }}>
                          {sim.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--gold-light)' }}>
                          ★ {(sim.vote_average || 0).toFixed(1)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Review & Rating Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        movie={movie}
        onReviewSubmitted={fetchReviews}
      />

      <style>{`
        @media (max-width: 820px) {
          .details-header-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .details-body-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MovieDetailsPage;
