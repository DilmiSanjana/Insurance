package com.example.secrud.repositories;

import com.example.secrud.models.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    
    // Find all complaints ordered by creation date (newest first)
    List<Complaint> findAllByOrderByCreatedAtDesc();
    
    // Find complaints by user email
    List<Complaint> findByUserEmailIgnoreCaseOrderByCreatedAtDesc(String userEmail);
    
    // Find complaints by status
    List<Complaint> findByStatusIgnoreCaseOrderByCreatedAtDesc(String status);
    
    // Find complaints by user email and status
    List<Complaint> findByUserEmailIgnoreCaseAndStatusIgnoreCaseOrderByCreatedAtDesc(String userEmail, String status);
    
    // Check if a complaint exists by user email and title (to prevent duplicates)
    boolean existsByUserEmailIgnoreCaseAndTitleIgnoreCase(String userEmail, String title);
    
    // Find complaints created within a date range
    @Query("SELECT c FROM Complaint c WHERE c.createdAt BETWEEN :startDate AND :endDate ORDER BY c.createdAt DESC")
    List<Complaint> findComplaintsByDateRange(@Param("startDate") LocalDateTime startDate, 
                                            @Param("endDate") LocalDateTime endDate);
    
    // Find complaints by title containing keyword (case insensitive)
    List<Complaint> findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(String keyword);
    
    // Find complaints by complaint description containing keyword (case insensitive)
    List<Complaint> findByComplaintContainingIgnoreCaseOrderByCreatedAtDesc(String keyword);
    
    // Count complaints by status
    long countByStatusIgnoreCase(String status);
    
    // Count complaints by user email
    long countByUserEmailIgnoreCase(String userEmail);
    
    // Find the most recent complaint by user email
    Optional<Complaint> findFirstByUserEmailIgnoreCaseOrderByCreatedAtDesc(String userEmail);
}