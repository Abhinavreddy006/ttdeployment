package com.healthsetu.backend.controller;

import com.healthsetu.backend.model.ChatRequest;
import com.healthsetu.backend.model.ChatResponse;
import com.healthsetu.backend.service.GeminiAiService;
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
        } catch (Exception e) {
            System.err.println("Clinical AI Chatbot fallback invoked: " + e.getMessage());
            return ResponseEntity.ok(new ChatResponse("Hello! I am your Clinical Copilot. Please share your symptoms or medical query, and I will assist you with clinical guidance."));
        }
    }
}