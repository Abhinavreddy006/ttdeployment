package com.healthsetu.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.healthsetu.backend.model.SoapNote;
import com.healthsetu.backend.service.ClinicalWorkflowService;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/clinical")
@CrossOrigin(origins = "*")
public class ClinicalWorkflowController {

    @Autowired
    private ClinicalWorkflowService workflowService;

    @PostMapping("/{caseId}/soap/generate")
    public ResponseEntity<?> generateSoapNote(@PathVariable Long caseId) {
        try {
            return new ResponseEntity<>(workflowService.generateSoapNote(caseId), HttpStatus.CREATED);
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (RuntimeException ex) {
            return new ResponseEntity<>("AI SOAP generation failed. Please try again.", HttpStatus.BAD_GATEWAY);
        }
    }

    @PostMapping("/{caseId}/soap")
    public ResponseEntity<?> addSoapNote(@PathVariable Long caseId, @RequestBody SoapNote note) {
        try {
            return new ResponseEntity<>(workflowService.saveSoapNote(caseId, note), HttpStatus.CREATED);
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/{caseId}/prescription/draft")
    public ResponseEntity<?> draftPrescription(@PathVariable Long caseId, @RequestBody Map<String, String> payload) {
        try {
            return new ResponseEntity<>(workflowService.draftPrescription(caseId, payload.get("medications")), HttpStatus.CREATED);
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{caseId}/prescription/sign/{professorId}")
    public ResponseEntity<?> signPrescription(@PathVariable Long caseId, @PathVariable Long professorId) {
        try {
            return ResponseEntity.ok(workflowService.signPrescription(caseId, professorId));
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.FORBIDDEN);
        }
    }
}