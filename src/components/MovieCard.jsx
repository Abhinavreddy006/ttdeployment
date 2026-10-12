import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import PosterImage, { getPosterUrl } from './PosterImage';
import RatingStars from './RatingStars';
import { Calendar, Globe, Play, Star, Trash2, X } from 'lucide-react';
import { tmdbService } from '../services/api';

const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
};

const MovieCard = ({ movie, onRemove }) => {
  const navigate = useNavigate();
  const [trailerUrl, setTrailerUrl] = useState('');
  const [trailerStatus, setTrailerStatus] = useState('idle');
  const [detailsStatus, setDetailsStatus] = useState('');

  useEffect(() => {
    if (!trailerUrl) return undefined;
    const handleKeyDown = event => {
      if (event.key === 'Escape') setTrailerUrl('');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trailerUrl]);

  if (!movie) return null;

  const id = movie.id || movie.tmdbId;
  if (!id) return null;

  const title = movie.title || movie.name || 'Untitled';
  const poster = movie.poster_path || movie.posterPath || movie.imageUrl || movie.posterUrl || movie.image;
  const posterSrc = getPosterUrl(poster, 'w500');
  const rating = movie.vote_average ?? movie.averageRating ?? 0;
  const ratingNumber = Number(rating);
  const accessibleRating = Number.isFinite(ratingNumber) ? ratingNumber : 0;
  const voteCount = movie.vote_count ?? movie.totalReviews;
  const releaseYear = movie.release_date?.substring(0, 4) || movie.releaseYear || '';
  const language = (movie.original_language || movie.language || '').toUpperCase();
  const resolvedTmdbId = movie.tmdbId || (!movie.isLocalCatalog ? movie.id : null);
  const detailsUrl = resolvedTmdbId
    ? `/movies/${resolvedTmdbId}`
    : `/explore?search=${encodeURIComponent(title)}`;

  const handleMovieOpen = async event => {
    if (resolvedTmdbId) return;
    event.preventDefault();
    try {
      const match = await tmdbService.findMovieByTitle(title, releaseYear);
      if (match?.id) navigate(`/movies/${match.id}`);
      else setDetailsStatus(`No exact TMDB match was found for "${title}".`);
    } catch (error) {
      console.error(`Unable to find movie details for "${title}".`, error);
      setDetailsStatus('Movie details are temporarily unavailable.');
    }
  };

  const handleWatchTrailer = async event => {
    event.preventDefault();
    event.stopPropagation();
    if (trailerStatus === 'loading') return;

    setTrailerStatus('loading');
    try {
      const url = await tmdbService.getTrailerUrl(movie);
      if (url) {
        setTrailerUrl(url);
        setTrailerStatus('idle');
      } else {
        setTrailerStatus('unavailable');
      }
    } catch (error) {
      console.error(`Unable to load the trailer for "${title}".`, error);
      setTrailerStatus('error');
    }
  };

  // Resolve genre name
  let genreName = (movie.genre || '').split(',')[0].trim();
  if (!genreName && Array.isArray(movie.genre_ids) && movie.genre_ids.length > 0) {
    genreName = GENRE_MAP[movie.genre_ids[0]] || '';
  } else if (!genreName && Array.isArray(movie.genres) && movie.genres.length > 0) {
    genreName = movie.genres[0].name;
  }

  return (
    <>
      <article className="movie-card">
        <div className="movie-card-poster-wrapper">
          <Link
            to={detailsUrl}
            className="movie-card-poster-link"
            onClick={handleMovieOpen}
            aria-label={`${title}${releaseYear ? `, ${releaseYear}` : ''}, rated ${accessibleRating.toFixed(1)} out of 10`}
          >
          <PosterImage
            src={posterSrc}
            alt={title}
            className="movie-card-poster"
            releaseYear={releaseYear}
            lookupByTitle={true}
          />
          </Link>

          {Number.isFinite(ratingNumber) && ratingNumber > 0 && (
            <span className="movie-card-poster-rating" aria-label={`Rated ${ratingNumber.toFixed(1)} out of 10`}>
              <Star size={12} fill="currentColor" aria-hidden="true" />
              {ratingNumber.toFixed(1)}
            </span>
          )}

          {genreName && (
            <div className="movie-card-genre">
              {genreName}
            </div>
          )}

          {language && language !== 'EN' && (
            <div className="movie-card-language">
              {language}
            </div>
          )}

          <button
            type="button"
            className="movie-card-trailer-button"
            onClick={handleWatchTrailer}
            disabled={trailerStatus === 'loading' || trailerStatus === 'unavailable'}
            aria-label={`Watch trailer for ${title}`}
          >
            <Play size={13} fill="currentColor" aria-hidden="true" />
            {trailerStatus === 'loading'
              ? 'Loading trailer…'
              : trailerStatus === 'unavailable'
                ? 'No trailer'
                : trailerStatus === 'error'
                  ? 'Retry trailer'
                  : 'Watch trailer'}
          </button>
        </div>

        <Link to={detailsUrl} className="movie-card-link" onClick={handleMovieOpen}>
          <div className="movie-card-content">
            <h3 className="movie-card-title">{title}</h3>

            <div className="movie-card-rating">
              <RatingStars rating={rating} totalReviews={voteCount} size={13} scale={10} />
            </div>

            <div className="movie-card-meta">
              <span className="movie-card-year">
                <Calendar size={13} aria-hidden="true" />
                {releaseYear || '—'}
              </span>
              {language && (
                <span className="movie-card-language-meta">
                  <Globe size={12} aria-hidden="true" />
                  {language}
                </span>
              )}
            </div>
          </div>
        </Link>
        {detailsStatus && <p className="movie-card-details-status" role="status">{detailsStatus}</p>}

        {onRemove && (
          <button
            type="button"
            className="movie-card-remove"
            onClick={(event) => onRemove(event, id)}
            aria-label={`Remove ${title} from watchlist`}
            title="Remove from watchlist"
          >
            <Trash2 size={15} />
          </button>
        )}
      </article>

      {trailerUrl && createPortal(
        <div
          className="trailer-modal-overlay"
          role="presentation"
          onClick={() => setTrailerUrl('')}
        >
          <section
            className="trailer-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${title} trailer`}
            onClick={event => event.stopPropagation()}
          >
            <header className="trailer-modal-header">
              <h2>{title} — Official Trailer</h2>
              <button type="button" onClick={() => setTrailerUrl('')} aria-label="Close trailer">
                <X size={20} />
              </button>
            </header>
            <div className="trailer-modal-video">
              <iframe
                src={trailerUrl}
                title={`${title} trailer`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </section>
        </div>,
        document.body
      )}
    </>
  );
};

export default MovieCard;
