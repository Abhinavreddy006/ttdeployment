import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Film,
  Play,
  Search,
  Sparkles,
  Star,
  PlusCircle
} from 'lucide-react';
import {
  getImageUrl,
  movieService,
  recommendationService,
  tmdbService,
  watchlistService
} from '../services/api';
import { getBackdropUrl, getPosterUrl } from '../utils/imageUtils';
import ErrorAlert from '../components/ErrorAlert';
import MovieCard from '../components/MovieCard';
import RatingStars from '../components/RatingStars';

const DISCOVERY_ROWS = [
  { key: 'trending', title: 'Trending This Week', description: 'The movies cinephiles and audiences are currently celebrating', load: () => tmdbService.getTrending('week') },
  { key: 'popular', title: 'Popular Releases', description: 'Widely watched across global audiences', load: () => tmdbService.getPopular() },
  { key: 'topRated', title: 'Top Rated Masterpieces', description: 'The all-time greatest cinematic achievements', load: () => tmdbService.getTopRated() },
  { key: 'nowPlaying', title: 'Now Playing in Theaters', description: 'Fresh cinematic releases currently on the silver screen', load: () => tmdbService.getNowPlaying() },
  { key: 'upcoming', title: 'Coming Soon', description: 'Upcoming anticipated stories to add to your calendar', load: () => tmdbService.getUpcoming() },
  { key: 'action', title: 'Action & Adventure', description: 'High-octane thrills, stunts, and daring journeys', genre: 28 },
  { key: 'sciFi', title: 'Sci-Fi & Speculative', description: 'Far horizons, visionary science, and cosmic sagas', genre: 878 },
  { key: 'drama', title: 'Compelling Drama', description: 'Profound character journeys, tension, and emotional depth', genre: 18 },
  { key: 'comedy', title: 'Witty Comedy', description: 'Clever laughs, escapist fun, and feel-good stories', genre: 35 },
  { key: 'thriller', title: 'Edge-of-Your-Seat Thrillers', description: 'Unrelenting suspense and mind-bending mysteries', genre: 53 },
  { key: 'romance', title: 'Romance & Passion', description: 'Timeless love stories and modern intimacies', genre: 10749 }
];

const GENRE_FILTERS = [
  { key: 'trending', label: 'Trending' },
  { key: 'topRated', label: 'Top Rated' },
  { key: 'nowPlaying', label: 'In Theaters' },
  { key: 'action', label: 'Action' },
  { key: 'sciFi', label: 'Sci-Fi' },
  { key: 'drama', label: 'Drama' },
  { key: 'comedy', label: 'Comedy' },
  { key: 'thriller', label: 'Thriller' },
  { key: 'romance', label: 'Romance' }
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

const MovieCarousel = ({
  title,
  description,
  movies,
  error,
  onRetry,
  loading = false,
  linkTo = '/explore',
  sectionId
}) => {
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
  }, [movies?.length]);

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
          {linkTo && (
            <Link to={linkTo} className="home-view-all">
              View all <ArrowRight size={15} />
            </Link>
          )}
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label={`Scroll ${title} left`}
            disabled={!movies || movies.length < 2 || loading || Boolean(error)}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label={`Scroll ${title} right`}
            disabled={!movies || movies.length < 2 || loading || Boolean(error)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      {loading ? (
        <MovieShelfSkeleton />
      ) : error ? (
        <ErrorAlert message={error} onRetry={onRetry} />
      ) : movies && movies.length > 0 ? (
        <>
          <div className="movie-shelf-track" ref={trackRef}>
            {movies.map(movie => (
              <MovieCard key={movie.id || movie.tmdbId} movie={movie} />
            ))}
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
        <p className="home-empty-message">No titles are available in this row currently.</p>
      )}
    </section>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const [moviesByRow, setMoviesByRow] = useState({});
  const [rowErrors, setRowErrors] = useState({});
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [recommendationError, setRecommendationError] = useState(null);

  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistReady, setWatchlistReady] = useState(false);
  const [watchlistBusy, setWatchlistBusy] = useState(false);
  const [actionError, setActionError] = useState(null);

  const checkHeroWatchlist = async (movie) => {
    if (!movie?.id) {
      setInWatchlist(false);
      setWatchlistReady(false);
      return;
    }
    setWatchlistReady(false);
    try {
      const exists = await watchlistService.checkWatchlist(movie.id);
      setInWatchlist(exists);
      setWatchlistReady(true);
    } catch {
      setInWatchlist(false);
      setWatchlistReady(false);
    }
  };

  const loadHome = async () => {
    setPageLoading(true);

    // Fetch local database movies from Spring Boot
    let collectionMovies = [];
    try {
      const localData = await movieService.getAllMovies();
      collectionMovies = localData.map(m => ({
        ...m,
        isLocalCatalog: true,
        id: m.tmdbId || m.id,
        tmdbId: m.tmdbId || m.id,
        poster_path: m.poster_path || m.posterPath || m.posterUrl,
        backdrop_path: m.backdrop_path || m.backdropPath || m.backdropUrl,
        vote_average: m.vote_average ?? m.voteAverage ?? m.averageRating,
        vote_count: m.vote_count ?? m.voteCount ?? m.totalReviews,
        release_date: m.release_date || (m.releaseYear ? `${m.releaseYear}-01-01` : ''),
        overview: m.overview || m.description
      }));
    } catch {
      // Local collection request failed or empty
    }

    // Load TMDB shelves
    const rowPromises = DISCOVERY_ROWS.map(async row => {
      try {
        const data = row.genre
          ? await tmdbService.discover({ withGenres: String(row.genre), sortBy: 'popularity.desc' })
          : await row.load();
        return { key: row.key, movies: data?.results || [], error: null };
      } catch (err) {
        return { key: row.key, movies: [], error: err.message };
      }
    });

    const results = await Promise.all(rowPromises);
    const newMoviesByRow = { collection: collectionMovies };
    const newRowErrors = {};

    results.forEach(({ key, movies, error }) => {
      newMoviesByRow[key] = movies;
      if (error) newRowErrors[key] = error;
    });

    setMoviesByRow(newMoviesByRow);
    setRowErrors(newRowErrors);

    // Dynamically bind featuredMovie to the first movie from trending list,
    // falling back to local collection or popular releases
    const trendingList = newMoviesByRow.trending || [];
    const featured = (trendingList.length > 0)
      ? trendingList[0]
      : (collectionMovies.length > 0
          ? collectionMovies[0]
          : ((newMoviesByRow.popular && newMoviesByRow.popular.length > 0) ? newMoviesByRow.popular[0] : null));

    setFeaturedMovie(featured);
    setHeroIndex(0);
    setPageLoading(false);

    if (featured) {
      await checkHeroWatchlist(featured);
    }
  };

  const selectHero = async (movie, index) => {
    setFeaturedMovie(movie);
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
    if (!featuredMovie || !watchlistReady || watchlistBusy) return;
    setWatchlistBusy(true);
    setActionError(null);
    try {
      if (inWatchlist) {
        await watchlistService.removeFromWatchlist(featuredMovie.id);
      } else {
        await watchlistService.addToWatchlist(featuredMovie);
      }
      setInWatchlist(!inWatchlist);
    } catch (error) {
      setActionError(error.message);
    } finally {
      setWatchlistBusy(false);
    }
  };

  const allTmdbRowsFailed = !pageLoading &&
    DISCOVERY_ROWS.every(row => Boolean(rowErrors[row.key]));

  const scrollToShelf = (key) => {
    document.getElementById(`shelf-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Helper to normalize titles for strict deduplication
  const normalizeMovieTitle = (title) => {
    return String(title || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();
  };

  // Strict global deduplication across Hero, Collection, Discovery shelves, and Recommendations
  // Ensures NO repeated movie titles anywhere on the page
  const seenTitles = new Set();
  if (featuredMovie?.title || featuredMovie?.name) {
    const heroKey = normalizeMovieTitle(featuredMovie.title || featuredMovie.name);
    if (heroKey) seenTitles.add(heroKey);
  }

  const dedupedCollection = (moviesByRow.collection || []).filter(movie => {
    const key = normalizeMovieTitle(movie.title || movie.name);
    if (!key || seenTitles.has(key)) return false;
    seenTitles.add(key);
    return true;
  });

  const dedupedDiscoveryRows = DISCOVERY_ROWS.map(row => {
    const rawMovies = moviesByRow[row.key] || [];
    const uniqueMovies = rawMovies.filter(movie => {
      const key = normalizeMovieTitle(movie.title || movie.name);
      if (!key || seenTitles.has(key)) return false;
      seenTitles.add(key);
      return true;
    });
    return { ...row, movies: uniqueMovies };
  }).filter(row => row.movies.length > 0);

  const dedupedRecommendations = (recommendations || []).filter(movie => {
    const key = normalizeMovieTitle(movie.title || movie.name);
    if (!key || seenTitles.has(key)) return false;
    seenTitles.add(key);
    return true;
  });

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
          {/* Dynamic Featured / Hero Banner Alignment */}
          <section
            className="cinematic-hero"
            style={{
              backgroundImage: (featuredMovie?.backdrop_path || featuredMovie?.backdropPath)
                ? `url("${getBackdropUrl(featuredMovie.backdrop_path || featuredMovie.backdropPath)}")`
                : undefined
            }}
          >
            <div className="cinematic-hero-shade" />
            <div className="container cinematic-hero-content">
              <span className="hero-eyebrow">
                <Sparkles size={14} /> YOUR NEXT FAVORITE STARTS HERE
              </span>
              {featuredMovie && (
                <>
                  <p className="hero-kicker">FEATURED MOVIE</p>
                  <h1>{featuredMovie?.title || featuredMovie?.name}</h1>
                  <div className="hero-rating">
                    <Star size={16} fill="var(--gold-primary)" color="var(--gold-primary)" />
                    <span className="hero-rating-val">
                      {(featuredMovie.vote_average ?? featuredMovie.averageRating ?? 0).toFixed(1)}/10
                    </span>
                    {(featuredMovie.vote_count ?? featuredMovie.totalReviews) ? (
                      <span className="hero-rating-count">
                        ({featuredMovie.vote_count ?? featuredMovie.totalReviews})
                      </span>
                    ) : null}
                    {(featuredMovie.release_date || featuredMovie.releaseYear) && (
                      <span className="hero-rating-year">
                        {(featuredMovie.release_date || '').slice(0, 4) || featuredMovie.releaseYear}
                      </span>
                    )}
                  </div>
                  <p className="hero-overview">
                    {featuredMovie?.overview || featuredMovie?.description || 'Explore the cast, critical reception, and community ratings for this film.'}
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

              {featuredMovie && (
                <div className="hero-actions">
                  <Link to={`/movies/${featuredMovie.id || featuredMovie.tmdbId}`} className="hero-btn-primary">
                    <Play size={16} fill="currentColor" /> Movie details
                  </Link>
                  <button
                    className="hero-btn-secondary"
                    onClick={toggleWatchlist}
                    disabled={!watchlistReady || watchlistBusy}
                  >
                    {watchlistBusy ? (
                      'Updating...'
                    ) : inWatchlist ? (
                      <><Check size={16} /> Saved in Watchlist</>
                    ) : (
                      <><Bookmark size={16} /> Add to Watchlist</>
                    )}
                  </button>
                </div>
              )}
              {actionError && <p className="home-action-error" role="alert">{actionError}</p>}
            </div>
          </section>

          <main className="container home-content">
            {/* Quick Navigation Filter Bar */}
            <nav className="genre-filter-bar" aria-label="Browse movie categories">
              {moviesByRow.collection?.length > 0 && (
                <button
                  type="button"
                  onClick={() => scrollToShelf('collection')}
                  style={{ borderColor: 'var(--gold-primary)', color: 'var(--gold-light)' }}
                >
                  <Film size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                  My Collection
                </button>
              )}
              {GENRE_FILTERS.map(filter => (
                <button key={filter.key} type="button" onClick={() => scrollToShelf(filter.key)}>
                  {filter.label}
                </button>
              ))}
            </nav>

            {/* Editorial Intro Banner */}
            <div className="home-intro">
              <div>
                <span className="home-overline">CINERATE CONCIERGE</span>
                <h2>Explore cinema crafted for every mood.</h2>
                <p>Curated discovery rows, verified community ratings, and live streaming metadata.</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Link to="/explore" className="home-discover-link">
                  Browse All Films <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Local Collection Shelf (strictly deduplicated against Hero) */}
            {dedupedCollection.length > 0 && (
              <MovieCarousel
                key="collection"
                title="From Your Collection"
                description="Custom movies saved directly in your personal CineRate MySQL database"
                movies={dedupedCollection}
                error={null}
                onRetry={loadHome}
                sectionId="collection"
                linkTo="/add-movie"
              />
            )}

            {/* TMDB Outage Notice (if TMDB token is missing or offline) */}
            {allTmdbRowsFailed && (
              <div style={{ margin: '2rem 0' }}>
                <ErrorAlert
                  message={
                    rowErrors.trending ||
                    "Live TMDB connection is pending. You can still manage your local collection, sign in, and write reviews."
                  }
                  onRetry={loadHome}
                />
              </div>
            )}

            {/* Live Discovery Shelves (strictly deduplicated across all shelves) */}
            {!allTmdbRowsFailed && dedupedDiscoveryRows.map(row => (
              <MovieCarousel
                key={row.key}
                title={row.title}
                description={row.description}
                movies={row.movies}
                error={rowErrors[row.key]}
                onRetry={loadHome}
                sectionId={row.key}
                linkTo={
                  row.genre
                    ? `/explore?genre=${row.genre}`
                    : `/explore?sort=${row.key === 'topRated' ? 'vote_average.desc' : 'popularity.desc'}`
                }
              />
            ))}

            {/* Personalized Recommendations Shelf (strictly deduplicated) */}
            {dedupedRecommendations.length > 0 && (
              <MovieCarousel
                title="Recommended For You"
                description="Algorithmic suggestions tailored to your watchlist, rated reviews, and favorite genres"
                movies={dedupedRecommendations}
                error={recommendationError}
                onRetry={loadRecommendations}
                loading={recommendationLoading}
                linkTo="/recommendations"
              />
            )}

            {/* Signature Recommendation CTA */}
            <section className="recommendation-cta">
              <div>
                <span><Star size={14} /> CINERATE FIND MY FILM</span>
                <h2>Find your perfect match in seconds.</h2>
                <p>Filter by mood, runtime, language, and era for an effortless cinema night.</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/recommendations" className="btn btn-gold">
                  Launch Concierge <ArrowRight size={16} />
                </Link>
                <Link to="/add-movie" className="btn btn-outline">
                  <PlusCircle size={15} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  Add New Movie
                </Link>
              </div>
            </section>
          </main>
        </>
      )}
    </div>
  );
};

export default HomePage;
