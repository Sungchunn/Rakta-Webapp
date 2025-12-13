package com.rakta.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * CORS configuration for frontend integration.
 * Allows Next.js (localhost:3000) to communicate with the API.
 */
@Configuration
public class CorsConfig {

        @org.springframework.beans.factory.annotation.Value("${spring.cors.allowed-origins}")
        private String[] allowedOrigins;

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();

                // Allowed origins - add production URL when deployed
                configuration.setAllowedOrigins(Arrays.asList(allowedOrigins));

                // Allowed HTTP methods
                configuration.setAllowedMethods(Arrays.asList(
                                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

                // Allowed headers
                configuration.setAllowedHeaders(Arrays.asList(
                                "Authorization",
                                "Content-Type",
                                "X-Requested-With",
                                "X-Idempotency-Key"));

                // Expose headers to frontend
                configuration.setExposedHeaders(List.of(
                                "Authorization"));

                // Allow credentials (cookies, auth headers)
                configuration.setAllowCredentials(true);

                // Cache preflight response for 1 hour
                configuration.setMaxAge(3600L);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);

                return source;
        }
}
