import React from 'react';
import { Link } from 'react-router-dom';
import PosterImage from './PosterImage';
import RatingStars from './RatingStars';
import { Calendar, Globe, Trash2 } from 'lucide-react';

const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
};

const MovieCard = ({ movie, onRemove }) => {
  if (!movie) return null;

  const id = movie.id || movie.tmdbId;
  if (!id) return null;

  const title = movie.title || movie.name || 'Untitled';
  const poster = movie.poster_path || movie.posterUrl;
  const rating = movie.vote_average ?? movie.averageRating ?? 0;
  const ratingNumber = Number(rating);
  const accessibleRating = Number.isFinite(ratingNumber) ? ratingNumber : 0;
  const voteCount = movie.vote_count ?? movie.totalReviews;
  const releaseYear = movie.release_date?.substring(0, 4) || movie.releaseYear || '';
  const language = (movie.original_language || movie.language || '').toUpperCase();

  // Resolve genre name
  let genreName = (movie.genre || '').split(',')[0].trim();
  if (!genreName && Array.isArray(movie.genre_ids) && movie.genre_ids.length > 0) {
    genreName = GENRE_MAP[movie.genre_ids[0]] || '';
  } else if (!genreName && Array.isArray(movie.genres) && movie.genres.length > 0) {
    genreName = movie.genres[0].name;
  }

  return (
    <article className="movie-card">
      <Link
        to={`/movies/${id}`}
        className="movie-card-link"
        aria-label={`${title}${releaseYear ? `, ${releaseYear}` : ''}, rated ${accessibleRating.toFixed(1)} out of 10`}
      >
        <div className="movie-card-poster-wrapper">
          <PosterImage src={poster} alt={title} className="movie-card-poster" />

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
        </div>

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
  );
};

export default MovieCard;
