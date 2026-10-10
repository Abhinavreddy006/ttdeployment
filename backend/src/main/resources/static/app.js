(() => {
  'use strict';

  const API_URL = '/api/tmdb/popular?page=1';
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
  const movieGrid = document.getElementById('movie-grid');
  const movieStatus = document.getElementById('movie-status');
  const currentYear = document.getElementById('current-year');

  if (!movieGrid || !movieStatus) return;
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());

  function showError(message) {
    movieStatus.replaceChildren();
    movieStatus.classList.add('error');
    const heading = document.createElement('strong');
    heading.textContent = 'Popular movies could not be loaded';
    const detail = document.createElement('span');
    detail.textContent = message;
    const retry = document.createElement('button');
    retry.className = 'retry-button';
    retry.type = 'button';
    retry.textContent = 'Try again';
    retry.addEventListener('click', loadPopularMovies);
    movieStatus.append(heading, detail, retry);
    movieStatus.hidden = false;
  }

  function createMovieCard(movie) {
    const card = document.createElement('article');
    card.className = 'movie-card';

    const posterWrap = document.createElement('div');
    posterWrap.className = 'poster-wrap';
    if (typeof movie.poster_path === 'string' && movie.poster_path.trim()) {
      const poster = document.createElement('img');
      poster.className = 'movie-poster';
      poster.src = `${IMAGE_BASE_URL}${movie.poster_path}`;
      poster.alt = movie.title ? `${movie.title} movie poster` : 'Movie poster';
      poster.loading = 'lazy';
      poster.decoding = 'async';
      poster.addEventListener('error', () => {
        poster.replaceWith(createPosterFallback(movie.title));
      }, { once: true });
      posterWrap.append(poster);
    } else {
      posterWrap.append(createPosterFallback(movie.title));
    }

    const rating = document.createElement('span');
    rating.className = 'rating-badge';
    const star = document.createElement('span');
    star.className = 'rating-star';
    star.setAttribute('aria-hidden', 'true');
    star.textContent = '★';
    const score = Number(movie.vote_average);
    const scoreText = document.createElement('span');
    scoreText.textContent = Number.isFinite(score) ? score.toFixed(1) : '—';
    rating.append(star, scoreText);
    posterWrap.append(rating);

    const info = document.createElement('div');
    info.className = 'movie-info';
    const title = document.createElement('h3');
    title.className = 'movie-title';
    title.textContent = typeof movie.title === 'string' && movie.title.trim() ? movie.title : 'Untitled movie';
    const year = document.createElement('p');
    year.className = 'movie-year';
    const releaseDate = typeof movie.release_date === 'string' ? movie.release_date : '';
    year.textContent = /^\d{4}/.test(releaseDate) ? releaseDate.slice(0, 4) : 'Release date unavailable';
    info.append(title, year);

    card.append(posterWrap, info);
    return card;
  }

  function createPosterFallback(title) {
    const fallback = document.createElement('div');
    fallback.className = 'poster-fallback';
    fallback.textContent = title ? `Poster unavailable · ${title}` : 'Poster unavailable';
    return fallback;
  }

  async function loadPopularMovies() {
    movieGrid.replaceChildren();
    movieStatus.classList.remove('error');
    movieStatus.replaceChildren();
    const spinner = document.createElement('span');
    spinner.className = 'loading-spinner';
    spinner.setAttribute('aria-hidden', 'true');
    const loadingText = document.createElement('span');
    loadingText.textContent = 'Loading popular movies…';
    movieStatus.append(spinner, loadingText);
    movieStatus.hidden = false;

    try {
      const response = await fetch(API_URL, {
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`The movie service returned HTTP ${response.status}. Check that Spring Boot and its TMDB configuration are running.`);
      }

      const payload = await response.json();
      const movies = Array.isArray(payload) ? payload : payload?.results;
      if (!Array.isArray(movies)) {
        throw new Error('The movie service returned an unexpected response. Expected a results list.');
      }
      if (movies.length === 0) {
        movieStatus.classList.remove('error');
        movieStatus.textContent = 'No popular movies were returned. Please try again in a moment.';
        return;
      }

      const fragment = document.createDocumentFragment();
      movies.forEach(movie => {
        if (movie && typeof movie === 'object') fragment.append(createMovieCard(movie));
      });
      movieGrid.append(fragment);
      movieStatus.hidden = true;
    } catch (error) {
      showError(error instanceof Error ? error.message : 'An unexpected error occurred while contacting the movie service.');
    }
  }

  loadPopularMovies();
})();
