package com.healthsetu.backend.controller;

import com.healthsetu.backend.model.ChatRequest;
import com.healthsetu.backend.model.ChatResponse;
import com.healthsetu.backend.service.GeminiAiService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ChatbotController {

    private static final int MAX_MESSAGE_LENGTH = 3000;
    private final GeminiAiService geminiAiService;

    public ChatbotController(GeminiAiService geminiAiService) {
        this.geminiAiService = geminiAiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        if (request == null || request.message() == null || request.message().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ChatResponse("Please enter a message."));
        }
        if (request.message().length() > MAX_MESSAGE_LENGTH) {
            return ResponseEntity.badRequest().body(new ChatResponse("Please limit your message to 3000 characters."));
        }

        try {
            String aiReply = geminiAiService.analyzeSymptoms(request.message().trim());
            return ResponseEntity.ok(new ChatResponse(aiReply));
            
        } catch (IllegalStateException exception) {
            if (exception.getMessage() != null && exception.getMessage().startsWith("Gemini API key is not configured")) {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body(new ChatResponse("The AI assistant is not configured. Set GEMINI_API_KEY on the backend and restart it."));
            }
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(new ChatResponse("The AI assistant is temporarily unavailable. Please try again."));
                    
        } catch (Exception e) {
            // Fallback to catch any 404s, 400s, or JSON parsing errors from the Gemini API
            System.err.println("Unexpected Gemini API Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ChatResponse("Unable to reach the clinical AI service. Please verify your Gemini model URL in application.properties."));
        }
    }
}