import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { tmdbService } from '../services/api';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { Search, RotateCcw, Filter, SlidersHorizontal } from 'lucide-react';

const GENRE_OPTIONS = [
  { id: 'all', name: 'All Genres' },
  { id: '28', name: 'Action' },
  { id: '12', name: 'Adventure' },
  { id: '16', name: 'Animation' },
  { id: '35', name: 'Comedy' },
  { id: '80', name: 'Crime' },
  { id: '99', name: 'Documentary' },
  { id: '18', name: 'Drama' },
  { id: '10751', name: 'Family' },
  { id: '14', name: 'Fantasy' },
  { id: '36', name: 'History' },
  { id: '27', name: 'Horror' },
  { id: '10402', name: 'Music' },
  { id: '9648', name: 'Mystery' },
  { id: '10749', name: 'Romance' },
  { id: '878', name: 'Sci-Fi' },
  { id: '53', name: 'Thriller' },
  { id: '10752', name: 'War' },
  { id: '37', name: 'Western' }
];

const LANGUAGE_OPTIONS = [
  { code: 'all', name: 'All Languages' },
  { code: 'en', name: 'English' },
  { code: 'te', name: 'Telugu' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'kn', name: 'Kannada' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' }
];

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'primary_release_date.desc', label: 'Newest Releases' },
  { value: 'vote_count.desc', label: 'Most Reviewed' }
];

const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get('search') || '';
  const initialGenre = searchParams.get('genre') || 'all';
  const initialSort = searchParams.get('sort') || 'popularity.desc';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedYear, setSelectedYear] = useState('');
  const [sortBy, setSortBy] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(1);

  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const nextSearch = searchParams.get('search') || '';
    const nextGenre = searchParams.get('genre') || 'all';
    const nextSort = searchParams.get('sort') || 'popularity.desc';

    setSearchTerm(nextSearch);
    setDebouncedSearch(nextSearch);
    setSelectedGenre(nextGenre);
    setSortBy(nextSort);
    setCurrentPage(1);
  }, [searchParams]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (debouncedSearch.trim()) {
        data = await tmdbService.searchMovies(debouncedSearch.trim(), currentPage, selectedLanguage);
      } else {
        data = await tmdbService.discover({
          language: selectedLanguage,
          withGenres: selectedGenre,
          sortBy,
          year: selectedYear ? parseInt(selectedYear) : undefined,
          page: currentPage
        });
      }

      setMovies(data.results || []);
      setTotalPages(Math.min(data.total_pages || 1, 50)); // Cap at 50 pages for smooth performance
      setTotalResults(data.total_results || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [debouncedSearch, selectedGenre, selectedLanguage, selectedYear, sortBy, currentPage]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedGenre('all');
    setSelectedLanguage('all');
    setSelectedYear('');
    setSortBy('popularity.desc');
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="explore-page fade-in" style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container">

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.45rem', color: 'var(--text-ivory)' }}>
            Explore Cinema
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem' }}>
            Search titles, filter by regional languages, genres, and sort through thousands of world films.
          </p>
        </div>

        {/* Filter Toolbar (Inspired by Next Movie reference) */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            alignItems: 'center'
          }}>
            {/* Search Input */}
            <div style={{ gridColumn: 'span 2' }} className="search-filter-col">
              <label className="form-label">Search Title</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g. Oppenheimer, RRR, Inception..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                />
                <Search size={16} style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-subtle)'
                }} />
              </div>
            </div>

            {/* Genre Filter */}
            <div>
              <label className="form-label">Genre</label>
              <select
                value={selectedGenre}
                onChange={(e) => { setSelectedGenre(e.target.value); setCurrentPage(1); }}
                className="form-select"
              >
                {GENRE_OPTIONS.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <label className="form-label">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => { setSelectedLanguage(e.target.value); setCurrentPage(1); }}
                className="form-select"
              >
                {LANGUAGE_OPTIONS.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>

            {/* Release Year */}
            <div>
              <label className="form-label">Release Year</label>
              <input
                type="number"
                placeholder="e.g. 2024"
                min="1900"
                max="2030"
                value={selectedYear}
                onChange={(e) => { setSelectedYear(e.target.value); setCurrentPage(1); }}
                className="form-input"
              />
            </div>

            {/* Sort Dropdown */}
            <div>
              <label className="form-label">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="form-select"
              >
                {SORT_OPTIONS.map(sort => (
                  <option key={sort.value} value={sort.value}>{sort.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active summary & reset */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.84rem',
            color: 'var(--text-muted)'
          }}>
            <span>
              {loading ? (
                'Searching live TMDB results...'
              ) : error ? (
                'Search results are unavailable.'
              ) : (
                <>Found <strong style={{ color: 'var(--gold-light)' }}>{totalResults.toLocaleString()}</strong> results</>
              )}
            </span>
            {(searchTerm || selectedGenre !== 'all' || selectedLanguage !== 'all' || selectedYear) && (
              <button
                onClick={handleResetFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.84rem'
                }}
              >
                <RotateCcw size={13} /> Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Loading state */}
        {loading && <LoadingSpinner message="Searching cinematic database..." />}

        {/* Error state */}
        {error && <ErrorAlert message={error} onRetry={fetchMovies} />}

        {/* Empty state */}
        {!loading && !error && movies.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '5rem 1.5rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px dashed var(--border-medium)',
            borderRadius: 'var(--radius-lg)',
            margin: '2rem 0'
          }}>
            <h3 style={{ fontSize: '1.45rem', marginBottom: '0.5rem', color: 'var(--text-ivory)' }}>
              No Movies Found
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
              No films match your search criteria. Try a different title, clear language filters, or reset selections.
            </p>
            <button onClick={handleResetFilters} className="btn btn-outline btn-sm">
              <RotateCcw size={14} /> Reset Search & Filters
            </button>
          </div>
        )}

        {/* Movie Grid */}
        {!loading && !error && movies.length > 0 && (
          <>
            <div className="movie-grid">
              {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        )}

      </div>

      <style>{`
        @media (max-width: 768px) {
          .search-filter-col {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ExplorePage;
