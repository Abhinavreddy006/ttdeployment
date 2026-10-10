package com.cinerate.cinerate.controller;

import com.cinerate.cinerate.entity.Movie;
import com.cinerate.cinerate.entity.Watchlist;
import com.cinerate.cinerate.repository.MovieRepository;
import com.cinerate.cinerate.repository.WatchlistRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    private final WatchlistRepository watchlistRepository;
    private final MovieRepository movieRepository;

    public WatchlistController(WatchlistRepository watchlistRepository, MovieRepository movieRepository) {
        this.watchlistRepository = watchlistRepository;
        this.movieRepository = movieRepository;
    }

    @GetMapping
    public List<Watchlist> getWatchlist() {
        return watchlistRepository.findAllByOrderByAddedAtDesc();
    }

    @GetMapping("/check/{tmdbId}")
    public Map<String, Boolean> checkWatchlist(@PathVariable Long tmdbId) {
        boolean exists = watchlistRepository.existsByTmdbId(tmdbId);
        return Collections.singletonMap("inWatchlist", exists);
    }

    @PostMapping
    public ResponseEntity<?> addToWatchlist(@RequestBody Watchlist item) {
        if (item.getTmdbId() == null) {
            return ResponseEntity.badRequest().body("TMDB movie ID is required.");
        }

        // Avoid duplicate entry
        Optional<Watchlist> existing = watchlistRepository.findByTmdbId(item.getTmdbId());
        if (existing.isPresent()) {
            return ResponseEntity.ok(existing.get());
        }

        Watchlist saved = watchlistRepository.save(item);

        // Sync to MySQL movies table
        try {
            Optional<Movie> movieOpt = movieRepository.findByTmdbId(item.getTmdbId());
            if (movieOpt.isEmpty()) {
                Movie movie = new Movie();
                movie.setTmdbId(item.getTmdbId());
                movie.setTitle(item.getTitle());
                movie.setPosterUrl(item.getPosterUrl());
                movie.setBackdropUrl(item.getBackdropUrl());
                movie.setGenre(item.getGenre());
                movie.setReleaseYear(item.getReleaseYear());
                movie.setAverageRating(item.getVoteAverage());
                movieRepository.save(movie);
            }
        } catch (Exception ignored) {
            // Non-critical sync
        }

        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{tmdbId}")
    public ResponseEntity<?> removeFromWatchlist(@PathVariable Long tmdbId) {
        watchlistRepository.deleteByTmdbId(tmdbId);
        return ResponseEntity.ok(Collections.singletonMap("success", true));
    }
}
