package com.rakta.service;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.List;

import com.rakta.dto.DashboardStatsDTO;

@Service
@Slf4j
@RequiredArgsConstructor
public class LlmClient {

    private static final String LLM_SERVICE = "openai";
    private static final Duration TIMEOUT = Duration.ofSeconds(30);
    private static final String FALLBACK_RESPONSE = "I'm having trouble connecting right now. Please try again in a moment.";

    private final WebClient openAiWebClient;

    @Value("${openai.model:gpt-4o-mini}")
    private String model;

    @Value("${openai.insight-model:gpt-4-turbo}")
    private String insightModel;

    @Value("${openai.temperature:0.7}")
    private double temperature;

    @CircuitBreaker(name = LLM_SERVICE, fallbackMethod = "fallbackInsightResponse")
    @Retry(name = LLM_SERVICE, fallbackMethod = "fallbackInsightResponse")
    public String generateDailyInsight(DashboardStatsDTO stats) {
        log.debug("Generating daily insight for user with stats");

        String systemPrompt = """
                You are Dr. Sloth, an expert Medical Data Analyst for the Rakta blood donation app.
                Your goal is to analyze the user's dashboard data and provide A SINGLE, HIGH-IMPACT daily insight or recommendation.

                ROLE:
                - You are a specialized medical AI agent.
                - Tone: Professional, encouraging, data-driven, yet accessible.
                - Format: Markdown. Use bolding for key metrics.

                DATA:
                %s

                INSTRUCTIONS:
                1. Analyze the 'Readiness' score, Hemoglobin trends, and Donation history.
                2. Identify the #1 most important thing the user should know today.
                3. If eligible to donate: Encourage it based on streaks/impact.
                4. If not eligible: Focus on recovery (Iron, Sleep, Hydration) based on low metrics.
                5. Keep it under 150 words.
                6. Do NOT be generic. Cite specific numbers from the data (e.g., "Your hemoglobin is 13.5").
                """;

        // Convert stats to JSON string for prompt context
        String statsJson = convertStatsToJson(stats);
        String finalPrompt = systemPrompt.formatted(statsJson);

        List<OpenAiMessage> messages = List.of(
                new OpenAiMessage("system", finalPrompt),
                new OpenAiMessage("user", "Give me my daily analysis."));

        OpenAiChatRequest chatRequest = OpenAiChatRequest.builder()
                .model(insightModel != null ? insightModel : "gpt-4-turbo")
                .temperature(0.7)
                .max_tokens(400)
                .messages(messages)
                .build();

        return executeRequest(chatRequest);
    }

    private String executeRequest(OpenAiChatRequest chatRequest) {
        OpenAiChatResponse response = openAiWebClient.post()
                .uri("/chat/completions")
                .bodyValue(chatRequest)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, clientResponse -> {
                    if (clientResponse.statusCode().value() == 429) {
                        log.warn("OpenAI rate limit hit (429). Will retry with backoff.");
                        return clientResponse.createException();
                    }
                    return clientResponse.createException();
                })
                .bodyToMono(OpenAiChatResponse.class)
                .timeout(TIMEOUT)
                .block();

        if (response != null && !response.getChoices().isEmpty()) {
            return response.getChoices().get(0).getMessage().getContent();
        }
        return FALLBACK_RESPONSE;
    }

    private String convertStatsToJson(Object stats) {
        try {
            return new com.fasterxml.jackson.databind.ObjectMapper()
                    .registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule())
                    .writeValueAsString(stats);
        } catch (Exception e) {
            log.error("Failed to serialize stats", e);
            return "Data unavailable";
        }
    }

    @SuppressWarnings("unused")
    private String fallbackInsightResponse(DashboardStatsDTO stats, Throwable t) {
        log.error("Failed to generate insight: {}", t.getMessage());
        return "I'm analyzing your data but hit a snag. Focus on good hydration and sleep today!";
    }

    @Data
    @Builder
    private static class OpenAiChatRequest {
        private String model;
        private double temperature;
        private int max_tokens;
        private List<OpenAiMessage> messages;
    }

    @Data
    @Builder
    private static class OpenAiMessage {
        private String role;
        private String content;

        public OpenAiMessage(String role, String content) {
            this.role = role;
            this.content = content;
        }
    }

    @Data
    private static class OpenAiChatResponse {
        private List<Choice> choices;

        @Data
        public static class Choice {
            private OpenAiMessage message;
        }
    }
}
