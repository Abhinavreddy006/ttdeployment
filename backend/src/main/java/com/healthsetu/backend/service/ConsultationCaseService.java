package com.healthsetu.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.healthsetu.backend.model.ConsultationCase;
import com.healthsetu.backend.model.SoapNote;
import com.healthsetu.backend.model.User;
import com.healthsetu.backend.repository.ConsultationCaseRepository;
import com.healthsetu.backend.repository.SoapNoteRepository;
import com.healthsetu.backend.repository.UserRepository;

import java.util.List;
import java.util.UUID;

@Service
public class ConsultationCaseService {

    @Autowired
    private ConsultationCaseRepository caseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SoapNoteRepository soapNoteRepository;

    @Autowired
    private GeminiAiService aiService;

    public ConsultationCase submitIntake(ConsultationCase newCase, Long rmpId) {
        // Link the RMP
        User rmp = userRepository.findById(rmpId)
            .orElseThrow(() -> new IllegalArgumentException("RMP not found with ID: " + rmpId));

        newCase.setRmp(rmp);
        newCase.setStatus("TRIAGED");
        newCase.setWebrtcRoomId("room-" + UUID.randomUUID().toString().substring(0, 8));
        
        ConsultationCase savedCase = caseRepository.save(newCase);

        // Trigger AI SOAP Note Generation in the background
        try {
            String vitals = String.format("BP: %s, Pulse: %d, Temp: %s, SpO2: %d", 
                    newCase.getVitalsBp(), newCase.getVitalsPulse(), newCase.getVitalsTemp(), newCase.getVitalsSpo2());
            
            String aiResponse = aiService.generateClinicalSummary(newCase.getRawSymptoms(), vitals);
            
            // Extract the text from Gemini's nested JSON response structure
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(aiResponse);
            String jsonContent = root.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText();
            
            // Parse our specific SOAP JSON format
            JsonNode soapData = mapper.readTree(jsonContent);

            SoapNote note = new SoapNote();
            note.setConsultationCase(savedCase);
            note.setSubjective(soapData.path("subjective").asText());
            note.setObjective(soapData.path("objective").asText());
            note.setAssessment(soapData.path("assessment").asText());
            note.setPlan(soapData.path("plan").asText());
            
            soapNoteRepository.save(note);
        } catch (Exception e) {
            System.err.println("AI Note Generation Failed, but case was saved: " + e.getMessage());
        }

        return savedCase;
    }

    public List<ConsultationCase> getCasesByRmp(Long rmpId) {
        return caseRepository.findByRmpId(rmpId);
    }

    public List<ConsultationCase> getPendingCases() {
        return caseRepository.findByStatus("TRIAGED");
    }
}