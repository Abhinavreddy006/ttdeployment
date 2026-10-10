
package com.cinerate.cinerate.service;

import java.net.URI;
import java.net.SocketException;
import java.net.SocketTimeoutException;
import java.net.UnknownHostException;

import javax.net.ssl.SSLException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

@Service
public class TmdbService {

    private static final Logger logger =
            LoggerFactory.getLogger(TmdbService.class);

    private final RestTemplate restTemplate;

    @Value("${tmdb.api.base-url:https://api.themoviedb.org/3}")
    private String baseUrl;

    @Value("${tmdb.api.read-access-token:}")
    private String readAccessToken;
    public TmdbService() {
        SimpleClientHttpRequestFactory factory =
                new SimpleClientHttpRequestFactory();

        factory.setConnectTimeout(15000);
        factory.setReadTimeout(30000);

        this.restTemplate = new RestTemplate(factory);
    }

    public boolean isConfigured() {
        return readAccessToken != null
                && !readAccessToken.trim().isEmpty();
    }

    private HttpHeaders createHeaders() {
        if (!isConfigured()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "TMDB access token is not configured. Set TMDB_API_READ_ACCESS_TOKEN in the Spring Boot environment."
            );
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(readAccessToken.trim());
        headers.set("Accept", "application/json");

        return headers;
    }

    private String executeGet(URI uri) {
        HttpEntity<Void> entity =
                new HttpEntity<>(createHeaders());

        try {
            ResponseEntity<String> response =
                    restTemplate.exchange(
                            uri,
                            HttpMethod.GET,
                            entity,
                            String.class
                    );

            return response.getBody();

        } catch (HttpClientErrorException e) {
            logger.error("TMDB HTTP error: {}", e.getStatusCode());

            if (e.getStatusCode().value() == 401) {
                throw new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "TMDB rejected the access token. Set a valid TMDB API Read Access Token as TMDB_API_READ_ACCESS_TOKEN and restart Spring Boot."
                );
            }

            if (e.getStatusCode().value() == 403) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "TMDB denied access to this request."
                );
            }

            if (e.getStatusCode().value() == 429) {
                throw new ResponseStatusException(
                        HttpStatus.TOO_MANY_REQUESTS,
                        "TMDB rate limit reached."
                );
            }

            throw new ResponseStatusException(
                    e.getStatusCode(),
                    "TMDB request failed with HTTP "
                            + e.getStatusCode().value()
            );

        } catch (HttpServerErrorException e) {
            logger.error("TMDB server error: {}", e.getStatusCode());

            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "TMDB server error. Please try again."
            );

        } catch (ResourceAccessException e) {
            Throwable cause = getRootCause(e);
            logger.error("TMDB connection error", e);

            String message;

            if (cause instanceof SSLException) {
                message = "TLS connection to TMDB failed.";
            } else if (cause instanceof SocketTimeoutException) {
                message = "Connection to TMDB timed out.";
            } else if (cause instanceof UnknownHostException) {
                message = "Cannot resolve api.themoviedb.org. Check your network.";
            } else if (cause instanceof SocketException) {
                message = "Connection to TMDB was reset or closed.";
            } else {
                message = "Network error connecting to TMDB.";
            }

            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    message
            );
        }
    }

    private Throwable getRootCause(Throwable error) {
        Throwable cause = error;

        while (cause.getCause() != null && cause.getCause() != cause) {
            cause = cause.getCause();
        }

        return cause;
    }

    public String getTrending(String timeWindow, int page) {
        String window = "day".equalsIgnoreCase(timeWindow)
                ? "day" : "week";

        URI uri = UriComponentsBuilder.fromUriString(baseUrl)
                .pathSegment("trending", "movie", window)
                .queryParam("page", page > 0 ? page : 1)
                .build()
                .toUri();

        return executeGet(uri);
    }

    public String getPopular(int page) {
        URI uri = UriComponentsBuilder.fromUriString(baseUrl)
                .pathSegment("movie", "popular")
                .queryParam("page", page > 0 ? page : 1)
                .build()
                .toUri();

        return executeGet(uri);
    }

    public String getTopRated(int page) {
        URI uri = UriComponentsBuilder.fromUriString(baseUrl)
                .pathSegment("movie", "top_rated")
                .queryParam("page", page > 0 ? page : 1)
                .build()
                .toUri();

        return executeGet(uri);
    }

    public String getNowPlaying(int page) {
        URI uri = UriComponentsBuilder.fromUriString(baseUrl)
                .pathSegment("movie", "now_playing")
                .queryParam("page", page > 0 ? page : 1)
                .build()
                .toUri();

        return executeGet(uri);
    }

    public String getUpcoming(int page) {
        URI uri = UriComponentsBuilder.fromUriString(baseUrl)
                .pathSegment("movie", "upcoming")
                .queryParam("page", page > 0 ? page : 1)
                .build()
                .toUri();

        return executeGet(uri);
    }

    public String getGenres() {
        URI uri = UriComponentsBuilder.fromUriString(baseUrl)
                .pathSegment("genre", "movie", "list")
                .build()
                .toUri();

        return executeGet(uri);
    }

    public String searchMovies(
            String query, int page, String language) {

        UriComponentsBuilder builder =
                UriComponentsBuilder.fromUriString(baseUrl)
                        .pathSegment("search", "movie")
                        .queryParam("query", query)
                        .queryParam("page", page > 0 ? page : 1);

        if (language != null
                && !language.trim().isEmpty()
                && !language.equalsIgnoreCase("all")) {
            builder.queryParam("language", language);
        }

        return executeGet(builder.build().toUri());
    }

    public String getMovieDetails(Long tmdbId) {
        URI uri = UriComponentsBuilder.fromUriString(baseUrl)
                .pathSegment("movie", String.valueOf(tmdbId))
                .queryParam(
                        "append_to_response",
                        "credits,videos,images,similar"
                )
                .build()
                .toUri();

        return executeGet(uri);
    }

    public String discoverMovies(
            String language,
            String withGenres,
            String sortBy,
            Integer year,
            int page) {

        UriComponentsBuilder builder =
                UriComponentsBuilder.fromUriString(baseUrl)
                        .pathSegment("discover", "movie")
                        .queryParam("page", page > 0 ? page : 1)
                        .queryParam("include_adult", false);

        if (language != null
                && !language.trim().isEmpty()
                && !language.equalsIgnoreCase("all")) {
            builder.queryParam("with_original_language", language);
        }

        if (withGenres != null
                && !withGenres.trim().isEmpty()
                && !withGenres.equalsIgnoreCase("all")) {
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
    }
}
