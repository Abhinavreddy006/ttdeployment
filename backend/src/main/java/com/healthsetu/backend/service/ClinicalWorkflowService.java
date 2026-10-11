package com.healthsetu.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.healthsetu.backend.model.ConsultationCase;
import com.healthsetu.backend.model.Prescription;
import com.healthsetu.backend.model.SoapNote;
import com.healthsetu.backend.model.User;
import com.healthsetu.backend.repository.ConsultationCaseRepository;
import com.healthsetu.backend.repository.PrescriptionRepository;
import com.healthsetu.backend.repository.SoapNoteRepository;
import com.healthsetu.backend.repository.UserRepository;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
public class ClinicalWorkflowService {

    @Autowired
    private SoapNoteRepository soapNoteRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private ConsultationCaseRepository caseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GeminiAiService aiService;

    @Autowired
    private ObjectMapper objectMapper;

    public SoapNote generateSoapNote(Long caseId) {
        ConsultationCase consultationCase = caseRepository.findById(caseId)
                .orElseThrow(() -> new IllegalArgumentException("Case not found"));

        String vitals = String.format("BP: %s, Pulse: %s, Temp: %s, SpO2: %s",
                consultationCase.getVitalsBp(),
                consultationCase.getVitalsPulse(),
                consultationCase.getVitalsTemp(),
                consultationCase.getVitalsSpo2());
        try {
            String response = aiService.generateClinicalSummary(consultationCase.getRawSymptoms(), vitals);
            JsonNode candidate = objectMapper.readTree(response).path("candidates").path(0);
            String generatedText = candidate.path("content").path("parts").path(0).path("text").asText();
            if (generatedText.isBlank()) {
                throw new IllegalStateException("The AI response did not contain a SOAP draft");
            }

            JsonNode generatedNote = objectMapper.readTree(generatedText);
            SoapNote note = soapNoteRepository.findByConsultationCaseId(caseId).orElseGet(SoapNote::new);
            note.setConsultationCase(consultationCase);
            note.setSubjective(generatedNote.path("subjective").asText());
            note.setObjective(generatedNote.path("objective").asText());
            note.setAssessment(generatedNote.path("assessment").asText());
            note.setPlan(generatedNote.path("plan").asText());
            return soapNoteRepository.save(note);
        } catch (IllegalArgumentException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new IllegalStateException("AI SOAP generation failed", exception);
        }
    }

    public SoapNote saveSoapNote(Long caseId, SoapNote note) {
        ConsultationCase consultationCase = caseRepository.findById(caseId)
                .orElseThrow(() -> new IllegalArgumentException("Case not found"));
        
        note.setConsultationCase(consultationCase);
        return soapNoteRepository.save(note);
    }

    public Prescription draftPrescription(Long caseId, String medications) {
        ConsultationCase consultationCase = caseRepository.findById(caseId)
                .orElseThrow(() -> new IllegalArgumentException("Case not found"));

        Prescription draft = prescriptionRepository.findByConsultationCaseId(caseId)
                .orElse(new Prescription());
        
        draft.setConsultationCase(consultationCase);
        draft.setMedications(medications);
        return prescriptionRepository.save(draft);
    }

    public Prescription signPrescription(Long caseId, Long professorId) {
        Prescription prescription = prescriptionRepository.findByConsultationCaseId(caseId)
                .orElseThrow(() -> new IllegalArgumentException("Draft prescription not found"));

        User professor = userRepository.findById(professorId)
                .orElseThrow(() -> new IllegalArgumentException("Professor not found"));

        if (!"SUPERVISING_PROFESSOR".equals(professor.getRole())) {
            throw new IllegalArgumentException("Only a supervising professor can sign prescriptions");
        }

        prescription.setSignedByProfessor(professor);
        prescription.setSignedAt(LocalDateTime.now());
        
        // Generate a basic SHA-256 cryptographic signature linking the meds, time, and professor
        try {
            String dataToSign = prescription.getMedications() + prescription.getSignedAt().toString() + professor.getId();
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(dataToSign.getBytes(StandardCharsets.UTF_8));
            prescription.setCryptographicSignature(Base64.getEncoder().encodeToString(hash));
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate cryptographic signature", e);
        }

        return prescriptionRepository.save(prescription);
    }
}