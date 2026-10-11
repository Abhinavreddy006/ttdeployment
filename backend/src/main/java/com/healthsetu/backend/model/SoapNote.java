package com.healthsetu.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "soap_notes")
public class SoapNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Links the note directly to the specific case
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false, unique = true)
    @JsonIgnore // Prevents infinite recursion when sending JSON back to the client
    private ConsultationCase consultationCase;

    @Column(columnDefinition = "TEXT")
    private String subjective;

    @Column(columnDefinition = "TEXT")
    private String objective;

    @Column(columnDefinition = "TEXT")
    private String assessment;

    @Column(columnDefinition = "TEXT")
    private String plan;

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ConsultationCase getConsultationCase() { return consultationCase; }
    public void setConsultationCase(ConsultationCase consultationCase) { this.consultationCase = consultationCase; }

    public String getSubjective() { return subjective; }
    public void setSubjective(String subjective) { this.subjective = subjective; }

    public String getObjective() { return objective; }
    public void setObjective(String objective) { this.objective = objective; }

    public String getAssessment() { return assessment; }
    public void setAssessment(String assessment) { this.assessment = assessment; }

    public String getPlan() { return plan; }
    public void setPlan(String plan) { this.plan = plan; }
}