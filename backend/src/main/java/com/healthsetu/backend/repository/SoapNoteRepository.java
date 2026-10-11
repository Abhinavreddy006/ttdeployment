package com.healthsetu.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.healthsetu.backend.model.SoapNote;
import java.util.Optional;

@Repository
public interface SoapNoteRepository extends JpaRepository<SoapNote, Long> {
    // Automatically generates SQL to find the SOAP note linked to a specific case ID
    Optional<SoapNote> findByConsultationCaseId(Long caseId);
}