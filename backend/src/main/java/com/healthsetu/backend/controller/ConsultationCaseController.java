package com.healthsetu.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.healthsetu.backend.model.ConsultationCase;
import com.healthsetu.backend.model.PendingCaseResponse;
import com.healthsetu.backend.service.ConsultationCaseService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cases")
@CrossOrigin(origins = "*")
public class ConsultationCaseController {

    @Autowired
    private ConsultationCaseService caseService;

    @PostMapping("/intake/{rmpId}")
    public ResponseEntity<?> submitCaseIntake(@RequestBody ConsultationCase newCase, @PathVariable Long rmpId) {
        try {
            ConsultationCase createdCase = caseService.submitIntake(newCase, rmpId);
            return new ResponseEntity<>(createdCase, HttpStatus.CREATED);
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/rmp/{rmpId}")
    public ResponseEntity<List<ConsultationCase>> getCasesByRmp(@PathVariable Long rmpId) {
        return ResponseEntity.ok(caseService.getCasesByRmp(rmpId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<PendingCaseResponse>> getPendingCases() {
        List<PendingCaseResponse> pendingCases = caseService.getPendingCases().stream()
                .map(PendingCaseResponse::from)
                .toList();
        return ResponseEntity.ok(pendingCases);
    }
}