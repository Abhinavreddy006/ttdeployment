package com.cinerate.cinerate.controller;

import com.cinerate.cinerate.entity.Movie;
import com.cinerate.cinerate.entity.Review;
import com.cinerate.cinerate.repository.MovieRepository;
import com.cinerate.cinerate.repository.ReviewRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final MovieRepository movieRepository;

    public ReviewController(ReviewRepository reviewRepository, MovieRepository movieRepository) {
        this.reviewRepository = reviewRepository;
        this.movieRepository = movieRepository;
    }

    @GetMapping("/movie/{tmdbId}")
    public List<Review> getReviewsByMovie(@PathVariable Long tmdbId) {
        return reviewRepository.findByTmdbIdOrderByCreatedAtDesc(tmdbId);
    }

    @PostMapping
    public ResponseEntity<?> submitReview(@RequestBody Review review) {
        if (review.getTmdbId() == null) {
            return ResponseEntity.badRequest().body("TMDB movie ID is required.");
        }
        if (review.getRating() == null || review.getRating() < 1 || review.getRating() > 10) {
            return ResponseEntity.badRequest().body("Rating must be between 1 and 10.");
        }
        if (review.getContent() == null || review.getContent().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Review comment cannot be empty.");
        }

        if (review.getAuthorName() == null || review.getAuthorName().trim().isEmpty()) {
            review.setAuthorName("Film Enthusiast");
        }

        Review savedReview = reviewRepository.save(review);

        // Synchronize and update aggregate rating in MySQL movies table
        try {
            Optional<Movie> movieOpt = movieRepository.findByTmdbId(review.getTmdbId());
            Movie movie = movieOpt.orElse(new Movie());
            movie.setTmdbId(review.getTmdbId());
            if (review.getMovieTitle() != null && !review.getMovieTitle().isEmpty()) {
                movie.setTitle(review.getMovieTitle());
            }

            List<Review> allReviews = reviewRepository.findByTmdbIdOrderByCreatedAtDesc(review.getTmdbId());
            double avg = allReviews.stream().mapToDouble(Review::getRating).average().orElse(0.0);
            movie.setAverageRating(Math.round(avg * 10.0) / 10.0);
            movie.setTotalReviews(allReviews.size());
            movieRepository.save(movie);
        } catch (Exception ignored) {
            // Non-critical sync
        }

        return ResponseEntity.ok(savedReview);
    }
}
