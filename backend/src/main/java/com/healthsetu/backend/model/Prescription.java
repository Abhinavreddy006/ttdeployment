package com.healthsetu.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false, unique = true)
    @JsonIgnore
    private ConsultationCase consultationCase;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String medications;

    @Column(length = 256)
    private String cryptographicSignature;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "signed_by_professor_id")
    @JsonIgnore
    private User signedByProfessor;

    private LocalDateTime signedAt;

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ConsultationCase getConsultationCase() { return consultationCase; }
    public void setConsultationCase(ConsultationCase consultationCase) { this.consultationCase = consultationCase; }

    public String getMedications() { return medications; }
    public void setMedications(String medications) { this.medications = medications; }

    public String getCryptographicSignature() { return cryptographicSignature; }
    public void setCryptographicSignature(String cryptographicSignature) { this.cryptographicSignature = cryptographicSignature; }

    public User getSignedByProfessor() { return signedByProfessor; }
    public void setSignedByProfessor(User signedByProfessor) { this.signedByProfessor = signedByProfessor; }

    public LocalDateTime getSignedAt() { return signedAt; }
    public void setSignedAt(LocalDateTime signedAt) { this.signedAt = signedAt; }
}