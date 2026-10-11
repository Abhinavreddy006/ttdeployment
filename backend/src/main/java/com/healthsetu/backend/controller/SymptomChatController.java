package com.healthsetu.backend.controller;

import com.healthsetu.backend.service.GeminiAiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@CrossOrigin(origins = "*")
public class SymptomChatController {

    private static final Logger logger = LoggerFactory.getLogger(SymptomChatController.class);
    private static final int MAX_SYMPTOM_LENGTH = 3000;

    private final GeminiAiService aiService;

    @Autowired
    public SymptomChatController(GeminiAiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/symptom-chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> payload) {
        String symptoms = payload.get("symptoms");
        if (symptoms == null || symptoms.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Describe the symptoms to continue."));
        }
        if (symptoms.length() > MAX_SYMPTOM_LENGTH) {
            return ResponseEntity.badRequest().body(Map.of("message", "Please limit the symptom description to 3000 characters."));
        }

        try {
            return ResponseEntity.ok(Map.of("response", aiService.analyzeSymptoms(symptoms.trim())));
        } catch (RuntimeException exception) {
            logger.error("Symptom chat request failed", exception);
            if (exception instanceof IllegalStateException
                    && exception.getMessage() != null
                    && exception.getMessage().startsWith("Gemini API key is not configured")) {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body(Map.of("message", "The AI assistant is not configured. Set GEMINI_API_KEY on the backend and restart it."));
            }
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("message", "The symptom assistant is temporarily unavailable. Please try again or contact a clinician."));
        }
    }
}
