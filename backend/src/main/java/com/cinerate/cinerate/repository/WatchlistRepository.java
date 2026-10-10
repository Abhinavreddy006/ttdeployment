package com.cinerate.cinerate.repository;

import com.cinerate.cinerate.entity.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {

    Optional<Watchlist> findByTmdbId(Long tmdbId);

    List<Watchlist> findAllByOrderByAddedAtDesc();

    boolean existsByTmdbId(Long tmdbId);

    @Transactional
    void deleteByTmdbId(Long tmdbId);
}
