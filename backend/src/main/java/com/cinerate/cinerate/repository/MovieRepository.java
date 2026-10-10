package com.cinerate.cinerate.repository;

import com.cinerate.cinerate.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    List<Movie> findByTitleContainingIgnoreCase(String title);

    Optional<Movie> findByTmdbId(Long tmdbId);
}
