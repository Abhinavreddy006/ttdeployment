import axios from 'axios';

// API base URL configured from environment variable
const BASE_URL = import.meta.env.DEV
  ? '/api'
  : (import.meta.env.VITE_API_BASE_URL || '/api');

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  timeout: 10000 // 10-second timeout
});

const TMDB_GENRE_NAMES = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
};

const movieLookupCache = new Map();

const normalizeMovieTitle = value => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

/**
 * Normalizes backend error messages into user-friendly strings.
 */
export const formatErrorMessage = (error) => {
  if (
    error.code === 'ERR_NETWORK' ||
    error.message?.includes('Network Error') ||
    (error.isAxiosError && !error.response)
  ) {
    return 'Unable to connect to the CineRate backend at ' + BASE_URL + '. Please ensure your Spring Boot server is running.';
  }
  if (!error.response && error.message) return error.message;
  if (error.response?.status === 503) {
    return error.response.data?.detail || error.response.data?.error || 'TMDB API token is not configured on the backend. Set TMDB_API_READ_ACCESS_TOKEN in the Spring Boot environment.';
  }
  if (error.response?.status === 404) {
    return 'The requested film or resource could not be found.';
  }
  if (error.response?.status === 401) {
    if (error.config?.url?.includes('/tmdb/')) {
      return error.response.data?.detail || 'TMDB rejected the backend token. Set a valid TMDB API Read Access Token as TMDB_API_READ_ACCESS_TOKEN and restart Spring Boot.';
    }
    return error.response.data?.error || error.response.data?.detail || 'The email or password is incorrect.';
  }
  if (error.response?.status === 400) {
    return typeof error.response.data === 'string'
      ? error.response.data
      : (error.response.data?.message || error.response.data?.detail || error.response.data?.error || 'Invalid request.');
  }
  return error.response?.data?.message || error.response?.data?.detail || error.response?.data?.error || error.message || 'An unexpected error occurred.';
};

/**
 * Builds TMDB image URL safely.
 * @param {string} path - relative path (e.g. "/path_to_image.jpg") or full HTTP(S) URL
 * @param {string} size - e.g. "w500", "original", "w300", "w185"
 */
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return '';
  const normalizedPath = path.trim();
  if (!normalizedPath) return '';
  if (/^https?:\/\//i.test(normalizedPath)) return normalizedPath;
  return `https://image.tmdb.org/t/p/${size}/${normalizedPath.replace(/^\/+/, '')}`;
};

const BROKEN_POSTER_REPLACEMENTS = {
  '9w019B9K12erA324': 'https://image.tmdb.org/t/p/w500/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg',
  '8cdWjvZ211M13968': 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg'
};

const sanitizeMovieItem = (movie) => {
  if (!movie || typeof movie !== 'object') return movie;
  const title = String(movie.title || movie.name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

  let poster = movie.poster_path || movie.posterPath || movie.posterUrl || movie.imageUrl || movie.image_url;
  let backdrop = movie.backdrop_path || movie.backdropPath || movie.backdropUrl;

  if (title === 'the wild robot' || title === 'wild robot' || (typeof poster === 'string' && poster.includes('9w019B9K12erA324'))) {
    poster = 'https://image.tmdb.org/t/p/w500/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg';
    if (!backdrop || String(backdrop).includes('undefined') || !String(backdrop).trim()) {
      backdrop = 'https://image.tmdb.org/t/p/original/eG9lz41mJqsI4J6ubMtVqD26q2J.jpg';
    }
  } else if (title.includes('deadpool') || (typeof poster === 'string' && poster.includes('8cdWjvZ211M13968'))) {
    poster = 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg';
    if (!backdrop || String(backdrop).includes('undefined') || !String(backdrop).trim()) {
      backdrop = 'https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg';
    }
  }

  return {
    ...movie,
    poster_path: poster || movie.poster_path,
    posterPath: poster || movie.posterPath,
    posterUrl: poster || movie.posterUrl,
    backdrop_path: backdrop || movie.backdrop_path,
    backdropPath: backdrop || movie.backdropPath,
    backdropUrl: backdrop || movie.backdropUrl
  };
};

const sanitizeMovieResults = (data) => {
  if (!data) return data;
  if (Array.isArray(data)) {
    return data.map(sanitizeMovieItem);
  }
  if (Array.isArray(data.results)) {
    return {
      ...data,
      results: data.results.map(sanitizeMovieItem)
    };
  }
  return sanitizeMovieItem(data);
};

/**
 * TMDB API services routed through Spring Boot backend
 */
export const tmdbService = {
  clearPosterLookupCache() {
    movieLookupCache.clear();
  },

  async getStatus() {
    try {
      const response = await apiClient.get('/tmdb/status');
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  async getTrending(firstArg = 'week', secondArg = 1) {
    let timeWindow = 'week';
    let page = 1;
    if (typeof firstArg === 'number') {
      page = firstArg;
    } else if (typeof firstArg === 'string') {
      timeWindow = firstArg;
      if (typeof secondArg === 'number') {
        page = secondArg;
      }
    }
    try {
      const response = await apiClient.get('/tmdb/trending', {
        params: { timeWindow, page }
      });
      return sanitizeMovieResults(response.data);
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  async getPopular(page = 1) {
    try {
      const response = await apiClient.get('/tmdb/popular', { params: { page } });
      return sanitizeMovieResults(response.data);
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  async getTopRated(page = 1) {
    try {
      const response = await apiClient.get('/tmdb/top-rated', { params: { page } });
      return sanitizeMovieResults(response.data);
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  async getNowPlaying(page = 1) {
    try {
      const response = await apiClient.get('/tmdb/now-playing', { params: { page } });
      return sanitizeMovieResults(response.data);
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  async getUpcoming(page = 1) {
    try {
      const response = await apiClient.get('/tmdb/upcoming', { params: { page } });
      return sanitizeMovieResults(response.data);
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  async getGenres() {
    try {
      const response = await apiClient.get('/tmdb/genres');
      if (!Array.isArray(response.data?.genres)) {
        throw new Error('The TMDB genre service returned an invalid response.');
      }
      return response.data.genres;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  async searchMovies(query, page = 1, language = '') {
    try {
      const params = { query, page };
      if (language && language !== 'all') params.language = language;
      const response = await apiClient.get('/tmdb/search', { params });
      return sanitizeMovieResults(response.data);
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  async findMovieByTitle(title, year) {
    const expectedTitle = normalizeMovieTitle(title);
    if (!expectedTitle) return '';

    const cacheKey = `${expectedTitle}|${year || ''}`;
    if (!movieLookupCache.has(cacheKey)) {
      const lookup = this.searchMovies(title).then(response => {
        const exactMatches = (response.results || []).filter(movie =>
          [movie.title, movie.original_title, movie.name, movie.original_name]
            .some(candidate => normalizeMovieTitle(candidate) === expectedTitle)
        );
        const matchingYear = year
          ? exactMatches.find(movie => movie.release_date?.slice(0, 4) === String(year))
          : null;
        return matchingYear || exactMatches[0] || null;
      }).catch(error => {
        movieLookupCache.delete(cacheKey);
        throw error;
      });
      movieLookupCache.set(cacheKey, lookup);
    }
    return movieLookupCache.get(cacheKey);
  },

  async getPosterByTitle(title, year) {
    const match = await this.findMovieByTitle(title, year);
    return match?.poster_path ? getImageUrl(match.poster_path, 'w500') : '';
  },

  async getTrailerUrl(movie) {
    let tmdbId = movie.tmdbId || movie.id;
    if (movie.isLocalCatalog || !/^\d+$/.test(String(tmdbId || ''))) {
      const match = await this.findMovieByTitle(
        movie.title || movie.name,
        movie.release_date?.slice(0, 4) || movie.releaseYear
      );
      tmdbId = match?.id;
    }
    if (!tmdbId) return '';

    const details = await this.getMovieDetails(tmdbId);
    const trailer = (details.videos?.results || [])
      .filter(video => video.site === 'YouTube' && video.type === 'Trailer' && video.key)
      .sort((first, second) => Number(second.official) - Number(first.official))[0];
    return trailer
      ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(trailer.key)}?autoplay=1&rel=0`
      : '';
  },

  async getMovieDetails(tmdbId) {
    try {
      const response = await apiClient.get(`/tmdb/movie/${tmdbId}`);
      return sanitizeMovieResults(response.data);
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  async discover({ language, withGenres, sortBy = 'popularity.desc', year, page = 1 }) {
    try {
      const params = { page, sortBy };
      if (language && language !== 'all') params.language = language;
      if (withGenres && withGenres !== 'all') params.withGenres = withGenres;
      if (year) params.year = year;
      const response = await apiClient.get('/tmdb/discover', { params });
      return sanitizeMovieResults(response.data);
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  }
};

/**
 * Community reviews persisted in MySQL
 */
export const reviewService = {
  async getReviews(tmdbId) {
    try {
      const response = await apiClient.get(`/reviews/movie/${tmdbId}`);
      if (!Array.isArray(response.data)) {
        throw new Error('The review service returned an invalid response.');
      }
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  async submitReview(reviewData) {
    try {
      const response = await apiClient.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  }
};

export const authService = {
  async getCsrfToken() {
    try {
      const response = await apiClient.get('/auth/csrf');
      return response.data.token;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  async register(account) {
    try {
      await authService.getCsrfToken();
      const response = await apiClient.post('/auth/register', account);
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  async login(credentials) {
    try {
      await authService.getCsrfToken();
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) return null;
      throw new Error(formatErrorMessage(error));
    }
  },

  async logout() {
    try {
      await authService.getCsrfToken();
      await apiClient.post('/auth/logout');
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  }
};

/**
 * User personal watchlist persisted in MySQL
 */
export const watchlistService = {
  async getWatchlist() {
    try {
      const response = await apiClient.get('/watchlist');
      if (!Array.isArray(response.data)) {
        throw new Error('The watchlist service returned an invalid response.');
      }
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  async checkWatchlist(tmdbId) {
    try {
      const response = await apiClient.get(`/watchlist/check/${tmdbId}`);
      if (typeof response.data?.inWatchlist !== 'boolean') {
        throw new Error('The watchlist service returned an invalid response.');
      }
      return response.data.inWatchlist;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  async addToWatchlist(movieData) {
    try {
      const payload = {
        tmdbId: movieData.id || movieData.tmdbId,
        title: movieData.title,
        posterUrl: movieData.poster_path ? getImageUrl(movieData.poster_path, 'w500') : (movieData.posterUrl || ''),
        backdropUrl: movieData.backdrop_path ? getImageUrl(movieData.backdrop_path, 'original') : (movieData.backdropUrl || ''),
        genre: Array.isArray(movieData.genres)
          ? movieData.genres.map(g => g.name).filter(Boolean).join(', ')
          : (movieData.genre || (movieData.genre_ids || [])
            .map(id => TMDB_GENRE_NAMES[id])
            .filter(Boolean)
            .join(', ')),
        releaseYear: movieData.release_date ? parseInt(movieData.release_date.substring(0, 4)) : (movieData.releaseYear || null),
        voteAverage: movieData.vote_average || movieData.averageRating || 0.0
      };
      const response = await apiClient.post('/watchlist', payload);
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  async removeFromWatchlist(tmdbId) {
    try {
      const response = await apiClient.delete(`/watchlist/${tmdbId}`);
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  }
};

export const recommendationService = {
  async getMovieRecommendations({
    language = 'all',
    fallbackGenres = [],
    minRating = 0,
    year,
    sortBy = 'popularity.desc'
  } = {}) {
    const [watchlist, genres] = await Promise.all([
      watchlistService.getWatchlist(),
      tmdbService.getGenres()
    ]);
    const reviewResults = await Promise.allSettled(
      watchlist.map(item => reviewService.getReviews(item.tmdbId))
    );
    const genreScores = new Map();
    let reviewFailures = 0;

    watchlist.forEach((item, index) => {
      const reviewsResult = reviewResults[index];
      const reviews = reviewsResult.status === 'fulfilled' ? reviewsResult.value : [];
      if (reviewsResult.status === 'rejected') reviewFailures += 1;

      const validRatings = reviews
        .map(review => Number(review.rating))
        .filter(rating => Number.isFinite(rating) && rating >= 1 && rating <= 10);
      const communityRating = validRatings.length
        ? validRatings.reduce((total, rating) => total + rating, 0) / validRatings.length
        : Number(item.voteAverage) || 5;
      const activityWeight = Math.max(0.5, Math.min(1.5, 1 + (communityRating - 5) / 10));
      const itemGenres = (item.genre || '')
        .split(',')
        .map(name => genres.find(genre => genre.name.toLowerCase() === name.trim().toLowerCase()))
        .filter(Boolean);

      itemGenres.forEach(genre => {
        genreScores.set(genre.id, (genreScores.get(genre.id) || 0) + activityWeight);
      });
    });

    fallbackGenres.forEach(id => {
      const genreId = Number(id);
      if (Number.isFinite(genreId)) {
        genreScores.set(genreId, (genreScores.get(genreId) || 0) + 0.65);
      }
    });

    const selectedGenreIds = [...genreScores.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => id);

    const data = await tmdbService.discover({
      language,
      withGenres: selectedGenreIds.join('|'),
      sortBy,
      year,
      page: 1
    });
    const watchedIds = new Set(watchlist.map(item => Number(item.tmdbId)));
    const movies = (data.results || [])
      .filter(movie => !watchedIds.has(Number(movie.id)) && Number(movie.vote_average) >= minRating)
      .slice(0, 10);

    return {
      movies,
      basedOnWatchlist: selectedGenreIds.some(id => watchlist.some(item =>
        (item.genre || '').split(',').some(name =>
          genres.find(genre => genre.id === id && genre.name.toLowerCase() === name.trim().toLowerCase())
        )
      )),
      genreNames: selectedGenreIds
        .map(id => genres.find(genre => genre.id === id)?.name)
        .filter(Boolean),
      reviewFailures
    };
  }
};

/**
 * Legacy movie service for backwards compatibility with GET /api/movies
 */
export const movieService = {
  async getAllMovies() {
    try {
      const response = await apiClient.get('/movies');
      if (!Array.isArray(response.data)) {
        throw new Error('The movie service returned an invalid response.');
      }
      return response.data.map(sanitizeMovieItem);
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },
  async getMovieById(id) {
    try {
      const response = await apiClient.get(`/movies/${id}`);
      return sanitizeMovieItem(response.data);
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },
  async searchMoviesByTitle(title) {
    try {
      const response = await apiClient.get('/movies/search', { params: { title } });
      if (!Array.isArray(response.data)) {
        throw new Error('The movie search service returned an invalid response.');
      }
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },
  async createMovie(data) {
    try {
      const response = await apiClient.post('/movies', data);
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },
  async updateMovie(id, data) {
    try {
      const response = await apiClient.put(`/movies/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },
  async deleteMovie(id) {
    try {
      const response = await apiClient.delete(`/movies/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  }
};

export default apiClient;
