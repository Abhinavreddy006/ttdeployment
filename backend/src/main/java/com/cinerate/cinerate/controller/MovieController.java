package com.cinerate.cinerate.controller;

import com.cinerate.cinerate.entity.Movie;
import com.cinerate.cinerate.repository.MovieRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieRepository movieRepository;

    public MovieController(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    // Get all movies
    @GetMapping
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    // Get single movie by ID or TMDB ID
    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable Long id) {
        return movieRepository.findById(id)
                .or(() -> movieRepository.findByTmdbId(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Add a movie
    @PostMapping
    public Movie addMovie(@RequestBody Movie movie) {
        return movieRepository.save(movie);
    }

    // Update an existing movie
    @PutMapping("/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable Long id, @RequestBody Movie updated) {
        return movieRepository.findById(id)
                .map(existing -> {
                    if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
                    if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
                    if (updated.getGenre() != null) existing.setGenre(updated.getGenre());
                    if (updated.getLanguage() != null) existing.setLanguage(updated.getLanguage());
                    if (updated.getDirector() != null) existing.setDirector(updated.getDirector());
                    if (updated.getReleaseYear() != null) existing.setReleaseYear(updated.getReleaseYear());
                    if (updated.getPosterUrl() != null) existing.setPosterUrl(updated.getPosterUrl());
                    if (updated.getBackdropUrl() != null) existing.setBackdropUrl(updated.getBackdropUrl());
                    return ResponseEntity.ok(movieRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete a movie from library
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable Long id) {
        return movieRepository.findById(id)
                .or(() -> movieRepository.findByTmdbId(id))
                .map(movie -> {
                    movieRepository.delete(movie);
                    return ResponseEntity.ok(Map.of("success", true, "message", "Movie removed from collection."));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Search movies by title
    @GetMapping("/search")
    public List<Movie> searchMovies(@RequestParam String title) {
        return movieRepository.findByTitleContainingIgnoreCase(title);
    }
}