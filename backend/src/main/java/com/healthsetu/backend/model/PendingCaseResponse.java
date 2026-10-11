package com.healthsetu.backend.model;

import java.time.LocalDateTime;

public record PendingCaseResponse(
        Long id,
        String patientName,
        Integer patientAge,
        String patientGender,
        String vitalsBp,
        Integer vitalsPulse,
        String vitalsTemp,
        Integer vitalsSpo2,
        String rawSymptoms,
        String urgencyLevel,
        String status,
        String webrtcRoomId,
        LocalDateTime createdAt) {

    public static PendingCaseResponse from(ConsultationCase consultationCase) {
        return new PendingCaseResponse(
                consultationCase.getId(),
                consultationCase.getPatientName(),
                consultationCase.getPatientAge(),
                consultationCase.getPatientGender(),
                consultationCase.getVitalsBp(),
                consultationCase.getVitalsPulse(),
                consultationCase.getVitalsTemp(),
                consultationCase.getVitalsSpo2(),
                consultationCase.getRawSymptoms(),
                consultationCase.getUrgencyLevel(),
                consultationCase.getStatus(),
                consultationCase.getWebrtcRoomId(),
                consultationCase.getCreatedAt());
    }
}
