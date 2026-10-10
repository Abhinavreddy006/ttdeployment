package com.cinerate.cinerate.controller;

import com.cinerate.cinerate.entity.Movie;
import com.cinerate.cinerate.entity.Review;
import com.cinerate.cinerate.entity.Watchlist;
import com.cinerate.cinerate.repository.MovieRepository;
import com.cinerate.cinerate.repository.ReviewRepository;
import com.cinerate.cinerate.repository.WatchlistRepository;
import com.cinerate.cinerate.service.TmdbService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tmdb")
public class TmdbController {

    private final TmdbService tmdbService;
    private final WatchlistRepository watchlistRepository;
    private final MovieRepository movieRepository;
    private final ReviewRepository reviewRepository;

    private static final Map<String, Integer> TMDB_GENRE_MAP = new HashMap<>();
    static {
        TMDB_GENRE_MAP.put("ACTION", 28);
        TMDB_GENRE_MAP.put("ADVENTURE", 12);
        TMDB_GENRE_MAP.put("ANIMATION", 16);
        TMDB_GENRE_MAP.put("COMEDY", 35);
        TMDB_GENRE_MAP.put("CRIME", 80);
        TMDB_GENRE_MAP.put("DOCUMENTARY", 99);
        TMDB_GENRE_MAP.put("DRAMA", 18);
        TMDB_GENRE_MAP.put("FAMILY", 10751);
        TMDB_GENRE_MAP.put("FANTASY", 14);
        TMDB_GENRE_MAP.put("HISTORY", 36);
        TMDB_GENRE_MAP.put("HORROR", 27);
        TMDB_GENRE_MAP.put("MUSIC", 10402);
        TMDB_GENRE_MAP.put("MYSTERY", 9648);
        TMDB_GENRE_MAP.put("ROMANCE", 10749);
        TMDB_GENRE_MAP.put("SCIENCE FICTION", 878);
        TMDB_GENRE_MAP.put("SCI-FI", 878);
        TMDB_GENRE_MAP.put("THRILLER", 53);
        TMDB_GENRE_MAP.put("WAR", 10752);
        TMDB_GENRE_MAP.put("WESTERN", 37);
    }

    public TmdbController(TmdbService tmdbService,
                          WatchlistRepository watchlistRepository,
                          MovieRepository movieRepository,
                          ReviewRepository reviewRepository) {
        this.tmdbService = tmdbService;
        this.watchlistRepository = watchlistRepository;
        this.movieRepository = movieRepository;
        this.reviewRepository = reviewRepository;
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        return ResponseEntity.ok(Collections.singletonMap("configured", tmdbService.isConfigured()));
    }

    @GetMapping(value = "/trending", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getTrending(
            @RequestParam(defaultValue = "week") String timeWindow,
            @RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(tmdbService.getTrending(timeWindow, page));
    }

    @GetMapping(value = "/popular", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getPopular(@RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(tmdbService.getPopular(page));
    }

    @GetMapping(value = "/top-rated", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getTopRated(@RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(tmdbService.getTopRated(page));
    }

    @GetMapping(value = "/now-playing", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getNowPlaying(@RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(tmdbService.getNowPlaying(page));
    }

    @GetMapping(value = "/upcoming", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getUpcoming(@RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(tmdbService.getUpcoming(page));
    }

    @GetMapping(value = "/genres", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getGenres() {
        return ResponseEntity.ok(tmdbService.getGenres());
    }

    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(required = false) String language) {
        return ResponseEntity.ok(tmdbService.searchMovies(query, page, language));
    }

    @GetMapping(value = "/movie/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getMovieDetails(@PathVariable Long id) {
        return ResponseEntity.ok(tmdbService.getMovieDetails(id));
    }

    @GetMapping(value = "/discover", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> discover(
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String withGenres,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) Integer year,
            @RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(tmdbService.discoverMovies(language, withGenres, sortBy, year, page));
    }

    @GetMapping(value = "/recommendations", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getRecommendations(@RequestParam(defaultValue = "1") int page) {
        List<Watchlist> savedWatchlist = watchlistRepository.findAllByOrderByAddedAtDesc();
        List<Review> savedReviews = reviewRepository.findAll();

        Map<String, Integer> genreCounts = new HashMap<>();
        boolean hasWatchlistActivity = false;
        boolean hasReviewActivity = false;

        for (Watchlist item : savedWatchlist) {
            if (item.getGenre() != null && !item.getGenre().trim().isEmpty()) {
                hasWatchlistActivity = true;
                String[] tokens = item.getGenre().split("[,/|]");
                for (String token : tokens) {
                    String clean = token.trim().toUpperCase();
                    if (!clean.isEmpty()) {
                        genreCounts.put(clean, genreCounts.getOrDefault(clean, 0) + 1);
                    }
                }
            }
        }

        for (Review review : savedReviews) {
            if (review.getRating() != null && review.getRating() >= 7.0 && review.getTmdbId() != null) {
                Optional<Movie> movieOpt = movieRepository.findByTmdbId(review.getTmdbId());
                if (movieOpt.isPresent() && movieOpt.get().getGenre() != null && !movieOpt.get().getGenre().trim().isEmpty()) {
                    hasReviewActivity = true;
                    String[] tokens = movieOpt.get().getGenre().split("[,/|]");
                    for (String token : tokens) {
                        String clean = token.trim().toUpperCase();
                        if (!clean.isEmpty()) {
                            genreCounts.put(clean, genreCounts.getOrDefault(clean, 0) + 2);
                        }
                    }
                }
            }
        }

        List<String> topGenres = genreCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .filter(TMDB_GENRE_MAP::containsKey)
                .limit(2)
                .collect(Collectors.toList());

        if (!topGenres.isEmpty()) {
            String genreIds = topGenres.stream()
                    .map(g -> String.valueOf(TMDB_GENRE_MAP.get(g)))
                    .collect(Collectors.joining("|"));

            String rawJson = tmdbService.discoverMovies(null, genreIds, "popularity.desc", null, page);

            String reason;
            if (hasWatchlistActivity && hasReviewActivity) {
                reason = "Curated based on genres from your saved Watchlist and top-rated Reviews: " + String.join(", ", topGenres);
            } else if (hasWatchlistActivity) {
                reason = "Curated based on genres in your saved Watchlist: " + String.join(", ", topGenres);
            } else {
                reason = "Curated based on genres from your top-rated Reviews: " + String.join(", ", topGenres);
            }

            String genresJson = topGenres.stream().map(g -> "\"" + g + "\"").collect(Collectors.joining(","));
            String metadata = "\"fallback\":false,\"recommendationType\":\"SAVED_ACTIVITY\",\"reason\":\"" + reason + "\",\"matchedGenres\":[" + genresJson + "],";
            String responseJson = (rawJson != null && rawJson.trim().startsWith("{"))
                    ? rawJson.replaceFirst("^\\{", "{" + metadata)
                    : rawJson;
            return ResponseEntity.ok(responseJson);
        } else {
            String rawJson = tmdbService.getTopRated(page);
            String reason = "General Recommendations: Based on top-rated cinema worldwide (Save titles to your Watchlist or rate films to tailor suggestions to your tastes)";
            String metadata = "\"fallback\":true,\"recommendationType\":\"GLOBAL_TOP_RATED\",\"reason\":\"" + reason + "\",\"matchedGenres\":[],";
            String responseJson = (rawJson != null && rawJson.trim().startsWith("{"))
                    ? rawJson.replaceFirst("^\\{", "{" + metadata)
                    : rawJson;
            return ResponseEntity.ok(responseJson);
        }
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleUnconfigured(IllegalStateException ex) {
        return ResponseEntity.status(503).body(Collections.singletonMap("error", ex.getMessage()));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleTmdbFailure(ResponseStatusException ex) {
        return ResponseEntity.status(ex.getStatusCode())
                .body(Collections.singletonMap("error", ex.getReason()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException ex) {
        return ResponseEntity.status(500).body(Collections.singletonMap("error", ex.getMessage()));
    }
}
