package com.rakta.service;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.time.Duration;
import java.util.Optional;

/**
 * Service for handling idempotent request processing.
 * Uses Caffeine cache to store request results with TTL for duplicate
 * prevention.
 * 
 * Prevents duplicate message processing when:
 * - User retries after timeout
 * - Network issues cause duplicate submissions
 * - Frontend double-submits
 */
@Service
@Slf4j
public class IdempotencyService {

    private static final Duration IDEMPOTENCY_TTL = Duration.ofMinutes(5);
    private static final long MAX_CACHE_SIZE = 10_000L;

    /**
     * Cache structure:
     * Key: idempotencyKey (UUID string)
     * Value: Cached response or processing marker
     */
    private Cache<String, CachedResponse> responseCache;

    @PostConstruct
    public void init() {
        this.responseCache = Caffeine.newBuilder()
                .maximumSize(MAX_CACHE_SIZE)
                .expireAfterWrite(IDEMPOTENCY_TTL)
                .recordStats()
                .build();
        log.info("Idempotency cache initialized with TTL={}, maxSize={}", IDEMPOTENCY_TTL, MAX_CACHE_SIZE);
    }

    /**
     * Check if a request with this idempotency key is already being processed or
     * was completed.
     * 
     * @param idempotencyKey The unique key for this request
     * @return Optional containing cached response if available, empty if new
     *         request
     */
    public Optional<Object> checkAndMark(String idempotencyKey) {
        if (idempotencyKey == null || idempotencyKey.isBlank()) {
            return Optional.empty(); // No idempotency key provided, process normally
        }

        CachedResponse existing = responseCache.getIfPresent(idempotencyKey);
        if (existing != null) {
            if (existing.isComplete()) {
                log.info("Idempotency hit: returning cached response for key={}", idempotencyKey);
                return Optional.of(existing.getResponse());
            } else {
                // Request is still processing
                log.warn("Idempotency conflict: request in progress for key={}", idempotencyKey);
                throw new IdempotencyConflictException("Request is already being processed");
            }
        }

        // Mark as processing
        responseCache.put(idempotencyKey, CachedResponse.processing());
        log.debug("Idempotency key marked as processing: {}", idempotencyKey);
        return Optional.empty();
    }

    /**
     * Complete a request by storing the response for future duplicate checks.
     */
    public void complete(String idempotencyKey, Object response) {
        if (idempotencyKey != null && !idempotencyKey.isBlank()) {
            responseCache.put(idempotencyKey, CachedResponse.completed(response));
            log.debug("Idempotency key completed: {}", idempotencyKey);
        }
    }

    /**
     * Clear a request marker (on failure, allow retry with same key).
     */
    public void clear(String idempotencyKey) {
        if (idempotencyKey != null && !idempotencyKey.isBlank()) {
            responseCache.invalidate(idempotencyKey);
            log.debug("Idempotency key cleared: {}", idempotencyKey);
        }
    }

    /**
     * Internal representation of cached response state.
     */
    private static class CachedResponse {
        private final boolean complete;
        private final Object response;

        private CachedResponse(boolean complete, Object response) {
            this.complete = complete;
            this.response = response;
        }

        static CachedResponse processing() {
            return new CachedResponse(false, null);
        }

        static CachedResponse completed(Object response) {
            return new CachedResponse(true, response);
        }

        boolean isComplete() {
            return complete;
        }

        Object getResponse() {
            return response;
        }
    }

    /**
     * Exception thrown when a duplicate request is detected while still processing.
     */
    public static class IdempotencyConflictException extends RuntimeException {
        public IdempotencyConflictException(String message) {
            super(message);
        }
    }
}
