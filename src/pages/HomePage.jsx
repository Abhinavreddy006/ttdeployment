import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Bookmark, Check, ChevronLeft, ChevronRight, Play, Search, Sparkles, Star } from 'lucide-react';
import { getImageUrl, recommendationService, tmdbService, watchlistService } from '../services/api';
import ErrorAlert from '../components/ErrorAlert';
import MovieCard from '../components/MovieCard';
import RatingStars from '../components/RatingStars';

const DISCOVERY_ROWS = [
  { key: 'trending', title: 'Trending', description: 'The movies everyone is talking about', load: () => tmdbService.getTrending('week') },
  { key: 'popular', title: 'Popular', description: 'Popular picks from movie fans', load: () => tmdbService.getPopular() },
  { key: 'topRated', title: 'Top Rated', description: 'Highest-rated movies on TMDB', load: () => tmdbService.getTopRated() },
  { key: 'upcoming', title: 'Coming Soon', description: 'Upcoming movies to look forward to', load: () => tmdbService.getUpcoming() },
  { key: 'nowPlaying', title: 'Now Playing', description: 'New movies currently in theaters', load: () => tmdbService.getNowPlaying() },
  { key: 'action', title: 'Action', genre: 28 },
  { key: 'comedy', title: 'Comedy', genre: 35 },
  { key: 'sciFi', title: 'Sci-Fi', genre: 878 },
  { key: 'drama', title: 'Drama', genre: 18 },
  { key: 'romance', title: 'Romance', genre: 10749 },
  { key: 'thriller', title: 'Thriller', genre: 53 },
  { key: 'kids', title: 'Kids', genre: '16,10751' },
  { key: 'family', title: 'Family', genre: 10751 },
  { key: 'documentary', title: 'Documentary', genre: 99 }
];

const GENRE_FILTERS = [
  { key: 'trending', label: 'Trending' },
  { key: 'action', label: 'Action' },
  { key: 'comedy', label: 'Comedy' },
  { key: 'sciFi', label: 'Sci-Fi' },
  { key: 'drama', label: 'Drama' },
  { key: 'romance', label: 'Romance' },
  { key: 'thriller', label: 'Thriller' },
  { key: 'kids', label: 'Kids' },
  { key: 'family', label: 'Family' },
  { key: 'documentary', label: 'Documentary' }
];

const MovieShelfSkeleton = () => (
  <div className="movie-shelf-track" aria-hidden="true">
    {Array.from({ length: 6 }, (_, index) => (
      <div className="movie-skeleton" key={index}>
        <div className="movie-skeleton-poster" />
        <div className="movie-skeleton-line" />
        <div className="movie-skeleton-line movie-skeleton-line-short" />
      </div>
    ))}
  </div>
);

const MovieCarousel = ({ title, description, movies, error, onRetry, loading = false, linkTo = '/explore', sectionId }) => {
  const trackRef = useRef(null);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const updatePagination = () => {
      const pages = Math.max(1, Math.ceil(track.scrollWidth / track.clientWidth));
      setPageCount(pages);
      setActivePage(Math.min(pages - 1, Math.round(track.scrollLeft / track.clientWidth)));
    };

    updatePagination();
    track.addEventListener('scroll', updatePagination, { passive: true });
    const resizeObserver = new ResizeObserver(updatePagination);
    resizeObserver.observe(track);
    return () => {
      track.removeEventListener('scroll', updatePagination);
      resizeObserver.disconnect();
    };
  }, [movies.length]);

  const scroll = (direction) => {
    if (trackRef.current) {
      trackRef.current.scrollBy({
        left: direction * trackRef.current.clientWidth * 0.8,
        behavior: 'smooth'
      });
    }
  };

  const goToPage = (page) => {
    if (trackRef.current) {
      trackRef.current.scrollTo({
        left: page * trackRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id={sectionId ? `shelf-${sectionId}` : undefined} className="home-movie-section">
      <div className="home-section-heading">
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        <div className="home-section-actions">
          <Link to={linkTo} className="home-view-all">
            View all <ArrowRight size={15} />
          </Link>
          <button type="button" onClick={() => scroll(-1)} aria-label={`Scroll ${title} left`} disabled={movies.length < 2 || loading || Boolean(error)}>
            <ChevronLeft size={18} />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label={`Scroll ${title} right`} disabled={movies.length < 2 || loading || Boolean(error)}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      {loading ? (
        <MovieShelfSkeleton />
      ) : error ? (
        <ErrorAlert message={error} onRetry={onRetry} />
      ) : movies.length > 0 ? (
        <>
          <div className="movie-shelf-track" ref={trackRef}>
            {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
          </div>
          {pageCount > 1 && (
            <div className="shelf-pagination" aria-label={`${title} carousel pages`}>
              {Array.from({ length: pageCount }, (_, page) => (
                <button
                  type="button"
                  key={page}
                  className={page === activePage ? 'active' : ''}
                  aria-label={`Show ${title} page ${page + 1}`}
                  aria-current={page === activePage ? 'true' : undefined}
                  onClick={() => goToPage(page)}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="home-empty-message">No movies are available in this row right now.</p>
      )}
    </section>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const [moviesByRow, setMoviesByRow] = useState({});
  const [rowErrors, setRowErrors] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationError, setRecommendationError] = useState(null);
  const [recommendationLoading, setRecommendationLoading] = useState(true);
  const [heroMovie, setHeroMovie] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistReady, setWatchlistReady] = useState(false);
  const [watchlistBusy, setWatchlistBusy] = useState(false);
  const [actionError, setActionError] = useState(null);

  const checkHeroWatchlist = async (movie) => {
    setWatchlistReady(false);
    setActionError(null);
    try {
      setInWatchlist(await watchlistService.checkWatchlist(movie.id));
      setWatchlistReady(true);
    } catch (error) {
      setActionError(error.message);
    }
  };

  const loadHome = async () => {
    setPageLoading(true);
    const requests = DISCOVERY_ROWS.map(async row => {
      if (row.genre) {
        return tmdbService.discover({ withGenres: String(row.genre), sortBy: 'popularity.desc' });
      }
      return row.load();
    });
    const results = await Promise.allSettled(requests);
    const nextMovies = {};
    const nextErrors = {};

    results.forEach((result, index) => {
      const row = DISCOVERY_ROWS[index];
      if (result.status === 'fulfilled') {
        nextMovies[row.key] = result.value.results || [];
      } else {
        nextErrors[row.key] = result.reason.message;
      }
    });

    setMoviesByRow(nextMovies);
    setRowErrors(nextErrors);
    const nextHero = nextMovies.trending?.[0] ||
      nextMovies.popular?.[0] ||
      nextMovies.topRated?.[0] ||
      nextMovies.nowPlaying?.[0] ||
      nextMovies.upcoming?.[0];

    setHeroMovie(nextHero || null);
    setHeroIndex(0);
    setPageLoading(false);

    if (nextHero) {
      await checkHeroWatchlist(nextHero);
    }
  };

  const selectHero = async (movie, index) => {
    setHeroMovie(movie);
    setHeroIndex(index);
    await checkHeroWatchlist(movie);
  };

  const loadRecommendations = async () => {
    setRecommendationLoading(true);
    setRecommendationError(null);
    try {
      const result = await recommendationService.getMovieRecommendations({
        fallbackGenres: [28, 35, 878, 10749],
        minRating: 6
      });
      setRecommendations(result.movies);
    } catch (error) {
      setRecommendationError(error.message);
    } finally {
      setRecommendationLoading(false);
    }
  };

  useEffect(() => {
    loadHome();
    loadRecommendations();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    if (query) navigate(`/explore?search=${encodeURIComponent(query)}`);
  };

  const toggleWatchlist = async () => {
    if (!heroMovie || !watchlistReady || watchlistBusy) return;
    setWatchlistBusy(true);
    setActionError(null);
    try {
      if (inWatchlist) {
        await watchlistService.removeFromWatchlist(heroMovie.id);
      } else {
        await watchlistService.addToWatchlist(heroMovie);
      }
      setInWatchlist(!inWatchlist);
    } catch (error) {
      setActionError(error.message);
    } finally {
      setWatchlistBusy(false);
    }
  };

  const heroMovies = moviesByRow.trending?.slice(0, 5) || [];
  const allRowsFailed = !pageLoading && Object.keys(rowErrors).length === DISCOVERY_ROWS.length;

  const scrollToShelf = (key) => {
    document.getElementById(`shelf-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="home-page fade-in">
      {pageLoading ? (
        <div className="home-loading">
          <div className="home-hero-skeleton" />
          <div className="container home-shelves-skeleton">
            <MovieShelfSkeleton />
            <MovieShelfSkeleton />
          </div>
        </div>
      ) : (
        <>
          <section
            className="cinematic-hero"
            style={{
              backgroundImage: heroMovie?.backdrop_path
                ? `url(${getImageUrl(heroMovie.backdrop_path, 'original')})`
                : undefined
            }}
          >
            <div className="cinematic-hero-shade" />
            <div className="container cinematic-hero-content">
              <span className="hero-eyebrow"><Sparkles size={14} /> Your next favorite starts here</span>
              {heroMovie ? (
                <>
                <p className="hero-kicker">Featured movie</p>
                <h1>{heroMovie.title || heroMovie.name}</h1>
                <div className="hero-rating">
                  <RatingStars rating={heroMovie.vote_average} totalReviews={heroMovie.vote_count} size={16} scale={10} />
                  {heroMovie.release_date && <span>{heroMovie.release_date.slice(0, 4)}</span>}
                </div>
                <p className="hero-overview">
                  {heroMovie.overview || 'Explore the cast, story, and community reviews for this movie.'}
                </p>
                </>
              ) : (
                <>
                  <p className="hero-kicker">CineRate discovery</p>
                  <h1>Find your next favorite film.</h1>
                  <p className="hero-overview">
                    Live movie data is temporarily unavailable. Search again or retry the connection below.
                  </p>
                </>
              )}
              <form onSubmit={handleSearch} className="home-search">
                <Search size={18} aria-hidden="true" />
                <input
                  type="search"
                  aria-label="Search movies"
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
                <button type="submit" aria-label="Search"><Search size={18} /></button>
              </form>
              {heroMovie && (
                <div className="hero-actions">
                  <Link to={`/movies/${heroMovie.id}`} className="btn btn-gold">
                    <Play size={16} fill="currentColor" /> Movie details
                  </Link>
                  <button
                    className="btn btn-outline"
                    onClick={toggleWatchlist}
                    disabled={!watchlistReady || watchlistBusy}
                  >
                    {watchlistBusy ? 'Saving...' : inWatchlist ? <><Check size={16} /> In Watchlist</> : <><Bookmark size={16} /> Add to Watchlist</>}
                  </button>
                </div>
              )}
              {actionError && <p className="home-action-error" role="alert">{actionError}</p>}
              {allRowsFailed && (
                <div style={{ maxWidth: '640px', marginTop: '1rem' }}>
                  <ErrorAlert message={Object.values(rowErrors)[0]} onRetry={loadHome} />
                </div>
              )}
            </div>
            {heroMovies.length > 1 && (
              <div className="hero-carousel-dots" aria-label="Featured movies">
                {heroMovies.map((movie, index) => (
                  <button
                    key={movie.id}
                    type="button"
                    className={index === heroIndex ? 'active' : ''}
                    aria-label={`Feature ${movie.title || movie.name}`}
                    aria-current={index === heroIndex ? 'true' : undefined}
                    onClick={() => selectHero(movie, index)}
                  />
                ))}
              </div>
            )}
          </section>

          <main className="container home-content">
            <nav className="genre-filter-bar" aria-label="Browse movie genres">
              {GENRE_FILTERS.map(filter => (
                <button key={filter.key} type="button" onClick={() => scrollToShelf(filter.key)}>
                  {filter.label}
                </button>
              ))}
            </nav>
            <div className="home-intro">
              <div>
                <span className="home-overline">CINERATE DISCOVERY</span>
                <h2>Find a film for every mood.</h2>
                <p>Fresh movie data from TMDB, curated into shelves for your next movie night.</p>
              </div>
              <Link to="/explore" className="home-discover-link">Explore all movies <ArrowRight size={16} /></Link>
            </div>

            {!allRowsFailed && DISCOVERY_ROWS.map(row => (
              <MovieCarousel
                key={row.key}
                title={row.title}
                description={row.description}
                movies={moviesByRow[row.key] || []}
                error={rowErrors[row.key]}
                onRetry={loadHome}
                sectionId={row.key}
                linkTo={row.genre ? `/explore?genre=${row.genre}` : `/explore?sort=${row.key === 'topRated' ? 'vote_average.desc' : 'popularity.desc'}`}
              />
            ))}

            <MovieCarousel
              title="Recommended For You"
              description="Recommendations based on your watchlist, review ratings, and genre preferences"
              movies={recommendations}
              error={recommendationError}
              onRetry={loadRecommendations}
              loading={recommendationLoading}
              linkTo="/recommendations"
            />

            <section className="recommendation-cta">
              <div>
                <span><Star size={14} /> PERSONALIZED PICKS</span>
                <h2>Make your next pick feel personal.</h2>
                <p>Choose a mood, language, and era to discover films matched to your taste.</p>
              </div>
              <Link to="/recommendations" className="btn btn-gold">Explore recommendations <ArrowRight size={16} /></Link>
            </section>
          </main>
        </>
      )}
    </div>
  );
};

export default HomePage;
