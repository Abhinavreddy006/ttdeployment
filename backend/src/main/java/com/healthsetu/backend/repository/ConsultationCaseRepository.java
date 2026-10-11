package com.healthsetu.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.healthsetu.backend.model.ConsultationCase;
import java.util.List;

@Repository
public interface ConsultationCaseRepository extends JpaRepository<ConsultationCase, Long> {
    // Automatically generates SQL to find all cases submitted by a specific RMP
    List<ConsultationCase> findByRmpId(Long rmpId);
    
    // Automatically generates SQL to find cases by their current status (e.g., TRIAGED)
    List<ConsultationCase> findByStatus(String status);
}