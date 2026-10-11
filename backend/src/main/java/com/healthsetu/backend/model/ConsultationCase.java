package com.healthsetu.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "consultation_cases")
public class ConsultationCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Patient Demographics
    @Column(nullable = false)
    private String patientName;
    private Integer patientAge;
    private String patientGender;

    // Vitals
    private String vitalsBp;
    private Integer vitalsPulse;
    private String vitalsTemp;
    private Integer vitalsSpo2;

    // Clinical Data
    @Column(columnDefinition = "TEXT")
    private String rawSymptoms;

    private String urgencyLevel = "LOW"; 
    private String department;
    private String status = "TRIAGED"; 
    
    @Column(unique = true)
    private String webrtcRoomId;

    // Relationships linking back to the Users table
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rmp_id", nullable = false)
    private User rmp;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_student_id")
    private User assignedStudent;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_professor_id")
    private User assignedProfessor;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public Integer getPatientAge() { return patientAge; }
    public void setPatientAge(Integer patientAge) { this.patientAge = patientAge; }

    public String getPatientGender() { return patientGender; }
    public void setPatientGender(String patientGender) { this.patientGender = patientGender; }

    public String getVitalsBp() { return vitalsBp; }
    public void setVitalsBp(String vitalsBp) { this.vitalsBp = vitalsBp; }

    public Integer getVitalsPulse() { return vitalsPulse; }
    public void setVitalsPulse(Integer vitalsPulse) { this.vitalsPulse = vitalsPulse; }

    public String getVitalsTemp() { return vitalsTemp; }
    public void setVitalsTemp(String vitalsTemp) { this.vitalsTemp = vitalsTemp; }

    public Integer getVitalsSpo2() { return vitalsSpo2; }
    public void setVitalsSpo2(Integer vitalsSpo2) { this.vitalsSpo2 = vitalsSpo2; }

    public String getRawSymptoms() { return rawSymptoms; }
    public void setRawSymptoms(String rawSymptoms) { this.rawSymptoms = rawSymptoms; }

    public String getUrgencyLevel() { return urgencyLevel; }
    public void setUrgencyLevel(String urgencyLevel) { this.urgencyLevel = urgencyLevel; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getWebrtcRoomId() { return webrtcRoomId; }
    public void setWebrtcRoomId(String webrtcRoomId) { this.webrtcRoomId = webrtcRoomId; }

    public User getRmp() { return rmp; }
    public void setRmp(User rmp) { this.rmp = rmp; }

    public User getAssignedStudent() { return assignedStudent; }
    public void setAssignedStudent(User assignedStudent) { this.assignedStudent = assignedStudent; }

    public User getAssignedProfessor() { return assignedProfessor; }
    public void setAssignedProfessor(User assignedProfessor) { this.assignedProfessor = assignedProfessor; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}