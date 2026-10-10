package com.cinerate.cinerate.repository;

import com.cinerate.cinerate.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByTmdbIdOrderByCreatedAtDesc(Long tmdbId);

    long countByTmdbId(Long tmdbId);
}
