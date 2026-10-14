package com.cinerate.cinerate.service;

import com.cinerate.cinerate.entity.Movie;
import com.cinerate.cinerate.repository.MovieRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

import javax.net.ssl.SSLException;
import java.net.SocketException;
import java.net.SocketTimeoutException;
import java.net.URI;
import java.net.UnknownHostException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TmdbService {

    private static final Logger logger = LoggerFactory.getLogger(TmdbService.class);

    private static final String DEFAULT_GENRES_JSON =
            "{\"genres\":[{\"id\":28,\"name\":\"Action\"},{\"id\":12,\"name\":\"Adventure\"},{\"id\":16,\"name\":\"Animation\"},{\"id\":35,\"name\":\"Comedy\"},{\"id\":80,\"name\":\"Crime\"},{\"id\":99,\"name\":\"Documentary\"},{\"id\":18,\"name\":\"Drama\"},{\"id\":10751,\"name\":\"Family\"},{\"id\":14,\"name\":\"Fantasy\"},{\"id\":36,\"name\":\"History\"},{\"id\":27,\"name\":\"Horror\"},{\"id\":10402,\"name\":\"Music\"},{\"id\":9648,\"name\":\"Mystery\"},{\"id\":10749,\"name\":\"Romance\"},{\"id\":878,\"name\":\"Sci-Fi\"},{\"id\":10770,\"name\":\"TV Movie\"},{\"id\":53,\"name\":\"Thriller\"},{\"id\":10752,\"name\":\"War\"},{\"id\":37,\"name\":\"Western\"}]}";

    private final RestTemplate restTemplate;
    private final ObjectProvider<MovieRepository> movieRepositoryProvider;

    @Value("${tmdb.api.base-url:https://api.themoviedb.org/3}")
    private String baseUrl;

    @Value("${tmdb.api.read-access-token:}")
    private String readAccessToken;

    public TmdbService(ObjectProvider<MovieRepository> movieRepositoryProvider) {
        this.movieRepositoryProvider = movieRepositoryProvider;

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000);
        factory.setReadTimeout(15000);
        this.restTemplate = new RestTemplate(factory);
    }

    public boolean isConfigured() {
        return readAccessToken != null && !readAccessToken.trim().isEmpty();
    }

    private HttpHeaders createHeaders() {
        if (!isConfigured()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "TMDB access token is not configured."
            );
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(readAccessToken.trim());
        headers.set("Accept", "application/json");
        return headers;
    }

    private String executeGet(URI uri) {
        HttpEntity<Void> entity = new HttpEntity<>(createHeaders());
        try {
            ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);
            return response.getBody();
        } catch (HttpClientErrorException e) {
            logger.error("TMDB HTTP error: {}", e.getStatusCode());
            if (e.getStatusCode().value() == 401) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "TMDB rejected the access token.");
            }
            if (e.getStatusCode().value() == 403) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "TMDB denied access.");
            }
            throw new ResponseStatusException(e.getStatusCode(), "TMDB request failed with HTTP " + e.getStatusCode().value());
        } catch (HttpServerErrorException | ResourceAccessException e) {
            logger.error("TMDB error: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "TMDB service error.");
        }
    }

    private List<Movie> getCatalogMovies() {
        MovieRepository repo = movieRepositoryProvider.getIfAvailable();
        if (repo != null) {
            return repo.findAll();
        }
        return Collections.emptyList();
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", " ")
                .replace("\r", " ");
    }

    private String movieToTmdbJson(Movie m) {
        String title = escapeJson(m.getTitle() != null ? m.getTitle() : "");
        String overview = escapeJson(m.getDescription() != null ? m.getDescription() : "");
        String poster = m.getPosterUrl() != null ? m.getPosterUrl() : "";
        String backdrop = m.getBackdropUrl() != null ? m.getBackdropUrl() : poster;
        String releaseDate = m.getReleaseYear() != null ? m.getReleaseYear() + "-01-01" : "2024-01-01";
        double rating = m.getAverageRating() != null ? m.getAverageRating() : 8.0;
        int votes = m.getTotalReviews() != null ? m.getTotalReviews() : 1000;
        long id = m.getTmdbId() != null ? m.getTmdbId() : (m.getId() != null ? m.getId() : 100L);

        return String.format(
                "{\"id\":%d,\"title\":\"%s\",\"overview\":\"%s\",\"poster_path\":\"%s\",\"backdrop_path\":\"%s\",\"vote_average\":%.1f,\"vote_count\":%d,\"release_date\":\"%s\"}",
                id, title, overview, poster, backdrop, rating, votes, releaseDate
        );
    }

    private String moviesToTmdbResponse(List<Movie> movies, int page) {
        StringBuilder sb = new StringBuilder();
        sb.append("{\"page\":").append(page > 0 ? page : 1)
                .append(",\"total_pages\":1,\"total_results\":").append(movies.size())
                .append(",\"results\":[");
        for (int i = 0; i < movies.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(movieToTmdbJson(movies.get(i)));
        }
        sb.append("]}");
        return sb.toString();
    }

    public String getTrending(String timeWindow, int page) {
        if (isConfigured()) {
            try {
                String window = "day".equalsIgnoreCase(timeWindow) ? "day" : "week";
                URI uri = UriComponentsBuilder.fromUriString(baseUrl)
                        .pathSegment("trending", "movie", window)
                        .queryParam("page", page > 0 ? page : 1)
                        .build().toUri();
                return executeGet(uri);
            } catch (Exception e) {
                logger.warn("Live TMDB trending failed, falling back to catalog: {}", e.getMessage());
            }
        }
        List<Movie> movies = getCatalogMovies().stream()
                .sorted((a, b) -> Integer.compare(b.getTotalReviews() != null ? b.getTotalReviews() : 0,
                                                  a.getTotalReviews() != null ? a.getTotalReviews() : 0))
                .collect(Collectors.toList());
        return moviesToTmdbResponse(movies, page);
    }

    public String getPopular(int page) {
        if (isConfigured()) {
            try {
                URI uri = UriComponentsBuilder.fromUriString(baseUrl)
                        .pathSegment("movie", "popular")
                        .queryParam("page", page > 0 ? page : 1)
                        .build().toUri();
                return executeGet(uri);
            } catch (Exception e) {
                logger.warn("Live TMDB popular failed, falling back to catalog: {}", e.getMessage());
            }
        }
        return moviesToTmdbResponse(getCatalogMovies(), page);
    }

    public String getTopRated(int page) {
        if (isConfigured()) {
            try {
                URI uri = UriComponentsBuilder.fromUriString(baseUrl)
                        .pathSegment("movie", "top_rated")
                        .queryParam("page", page > 0 ? page : 1)
                        .build().toUri();
                return executeGet(uri);
            } catch (Exception e) {
                logger.warn("Live TMDB top-rated failed, falling back to catalog: {}", e.getMessage());
            }
        }
        List<Movie> movies = getCatalogMovies().stream()
                .sorted((a, b) -> Double.compare(b.getAverageRating() != null ? b.getAverageRating() : 0.0,
                                                 a.getAverageRating() != null ? a.getAverageRating() : 0.0))
                .collect(Collectors.toList());
        return moviesToTmdbResponse(movies, page);
    }

    public String getNowPlaying(int page) {
        if (isConfigured()) {
            try {
                URI uri = UriComponentsBuilder.fromUriString(baseUrl)
                        .pathSegment("movie", "now_playing")
                        .queryParam("page", page > 0 ? page : 1)
                        .build().toUri();
                return executeGet(uri);
            } catch (Exception e) {
                logger.warn("Live TMDB now-playing failed, falling back to catalog: {}", e.getMessage());
            }
        }
        List<Movie> movies = getCatalogMovies().stream()
                .sorted((a, b) -> Integer.compare(b.getReleaseYear() != null ? b.getReleaseYear() : 0,
                                                  a.getReleaseYear() != null ? a.getReleaseYear() : 0))
                .collect(Collectors.toList());
        return moviesToTmdbResponse(movies, page);
    }

    public String getUpcoming(int page) {
        if (isConfigured()) {
            try {
                URI uri = UriComponentsBuilder.fromUriString(baseUrl)
                        .pathSegment("movie", "upcoming")
                        .queryParam("page", page > 0 ? page : 1)
                        .build().toUri();
                return executeGet(uri);
            } catch (Exception e) {
                logger.warn("Live TMDB upcoming failed, falling back to catalog: {}", e.getMessage());
            }
        }
        List<Movie> movies = getCatalogMovies().stream()
                .filter(m -> m.getReleaseYear() != null && m.getReleaseYear() >= 2024)
                .collect(Collectors.toList());
        if (movies.isEmpty()) movies = getCatalogMovies();
        return moviesToTmdbResponse(movies, page);
    }

    public String getGenres() {
        if (isConfigured()) {
            try {
                URI uri = UriComponentsBuilder.fromUriString(baseUrl)
                        .pathSegment("genre", "movie", "list")
                        .build().toUri();
                return executeGet(uri);
            } catch (Exception e) {
                logger.warn("Live TMDB genres failed: {}", e.getMessage());
            }
        }
        return DEFAULT_GENRES_JSON;
    }

    public String searchMovies(String query, int page, String language) {
        if (isConfigured()) {
            try {
                UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(baseUrl)
                        .pathSegment("search", "movie")
                        .queryParam("query", query)
                        .queryParam("page", page > 0 ? page : 1);
                if (language != null && !language.trim().isEmpty() && !language.equalsIgnoreCase("all")) {
                    builder.queryParam("language", language);
                }
                return executeGet(builder.build().toUri());
            } catch (Exception e) {
                logger.warn("Live TMDB search failed, falling back to catalog: {}", e.getMessage());
            }
        }
        String cleanQuery = query != null ? query.trim().toLowerCase() : "";
        List<Movie> matched = getCatalogMovies().stream()
                .filter(m -> m.getTitle() != null && m.getTitle().toLowerCase().contains(cleanQuery))
                .collect(Collectors.toList());
        return moviesToTmdbResponse(matched, page);
    }

    public String getMovieDetails(Long tmdbId) {
        if (isConfigured()) {
            try {
                URI uri = UriComponentsBuilder.fromUriString(baseUrl)
                        .pathSegment("movie", String.valueOf(tmdbId))
                        .queryParam("append_to_response", "credits,videos,images,similar")
                        .build().toUri();
                return executeGet(uri);
            } catch (Exception e) {
                logger.warn("Live TMDB movie details failed, falling back to catalog: {}", e.getMessage());
            }
        }

        MovieRepository repo = movieRepositoryProvider.getIfAvailable();
        if (repo != null) {
            Optional<Movie> movieOpt = repo.findByTmdbId(tmdbId).or(() -> repo.findById(tmdbId));
            if (movieOpt.isPresent()) {
                Movie m = movieOpt.get();
                return String.format(
                        "{\"id\":%d,\"title\":\"%s\",\"overview\":\"%s\",\"poster_path\":\"%s\",\"backdrop_path\":\"%s\",\"vote_average\":%.1f,\"vote_count\":%d,\"release_date\":\"%s\",\"genres\":[{\"id\":28,\"name\":\"%s\"}],\"credits\":{\"cast\":[{\"name\":\"%s\",\"character\":\"Lead\"}]},\"videos\":{\"results\":[]}}",
                        m.getTmdbId() != null ? m.getTmdbId() : m.getId(),
                        escapeJson(m.getTitle()),
                        escapeJson(m.getDescription()),
                        m.getPosterUrl() != null ? m.getPosterUrl() : "",
                        m.getBackdropUrl() != null ? m.getBackdropUrl() : (m.getPosterUrl() != null ? m.getPosterUrl() : ""),
                        m.getAverageRating() != null ? m.getAverageRating() : 8.0,
                        m.getTotalReviews() != null ? m.getTotalReviews() : 1000,
                        m.getReleaseYear() != null ? m.getReleaseYear() + "-01-01" : "2024-01-01",
                        escapeJson(m.getGenre() != null ? m.getGenre() : "Action"),
                        escapeJson(m.getDirector() != null ? m.getDirector() : "Director")
                );
            }
        }
        return "{\"id\":" + tmdbId + ",\"title\":\"Movie\",\"overview\":\"Synopsis unavailable\",\"genres\":[],\"credits\":{\"cast\":[]},\"videos\":{\"results\":[]}}";
    }

    public String discoverMovies(String language, String withGenres, String sortBy, Integer year, int page) {
        if (isConfigured()) {
            try {
                UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(baseUrl)
                        .pathSegment("discover", "movie")
                        .queryParam("page", page > 0 ? page : 1)
                        .queryParam("include_adult", false);

                if (language != null && !language.trim().isEmpty() && !language.equalsIgnoreCase("all")) {
                    builder.queryParam("with_original_language", language);
                }
                if (withGenres != null && !withGenres.trim().isEmpty() && !withGenres.equalsIgnoreCase("all")) {
                    builder.queryParam("with_genres", withGenres);
                }
                if (sortBy != null && !sortBy.trim().isEmpty()) {
                    builder.queryParam("sort_by", sortBy);
                } else {
                    builder.queryParam("sort_by", "popularity.desc");
                }
                if (year != null && year > 1900) {
                    builder.queryParam("primary_release_year", year);
                }
                return executeGet(builder.build().toUri());
            } catch (Exception e) {
                logger.warn("Live TMDB discover failed, falling back to catalog: {}", e.getMessage());
            }
        }

        // Resilient fallback by genre matching
        Map<String, String> genreMap = Map.of(
                "28", "action",
                "12", "adventure",
                "16", "animation",
                "35", "comedy",
                "80", "crime",
                "18", "drama",
                "27", "horror",
                "10749", "romance",
                "878", "sci-fi",
                "53", "thriller"
        );

        String targetKeyword = withGenres != null ? genreMap.getOrDefault(withGenres.trim(), withGenres.toLowerCase()) : "";
        List<Movie> filtered = getCatalogMovies().stream()
                .filter(m -> {
                    if (!targetKeyword.isEmpty() && m.getGenre() != null) {
                        return m.getGenre().toLowerCase().contains(targetKeyword);
                    }
                    return true;
                })
                .collect(Collectors.toList());

        if (filtered.isEmpty()) {
            filtered = getCatalogMovies();
        }

        return moviesToTmdbResponse(filtered, page);
    }
}
