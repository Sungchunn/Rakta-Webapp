package com.rakta.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Infrastructure health check controller for Docker/Traefik healthchecks.
 * This endpoint is explicitly allowed in SecurityConfig without authentication.
 */
@RestController
public class InfraHealthController {

    @GetMapping("/healthz")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of("status", "ok"));
    }
}
