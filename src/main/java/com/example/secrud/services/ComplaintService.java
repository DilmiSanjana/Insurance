package com.example.secrud.services;

import com.example.secrud.models.Complaint;
import com.example.secrud.repositories.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
@Transactional
public class ComplaintService {
    
    private final ComplaintRepository complaintRepository;
    
    // Email validation pattern
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    );
    
    // Valid status values
    private static final String[] VALID_STATUSES = {"PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"};
    
    @Autowired
    public ComplaintService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }
    
    /**
     * Create a new complaint with validation
     */
    public Complaint createComplaint(Complaint complaint) {
        validateComplaint(complaint);
        
        // Normalize data
        complaint.setUserEmail(complaint.getUserEmail().trim().toLowerCase());
        complaint.setTitle(complaint.getTitle().trim());
        complaint.setComplaint(complaint.getComplaint().trim());
        complaint.setStatus("PENDING"); // Always start with PENDING status
        
        // Check for duplicate complaints (same user email and title)
        if (complaintRepository.existsByUserEmailIgnoreCaseAndTitleIgnoreCase(
                complaint.getUserEmail(), complaint.getTitle())) {
            throw new IllegalArgumentException("A complaint with the same title already exists for this email");
        }
        
        return complaintRepository.save(complaint);
    }
    
    /**
     * Get all complaints ordered by creation date (newest first)
     */
    @Transactional(readOnly = true)
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc();
    }
    
    /**
     * Get complaint by ID
     */
    @Transactional(readOnly = true)
    public Optional<Complaint> getComplaintById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid complaint ID");
        }
        return complaintRepository.findById(id);
    }
    
    /**
     * Get complaints by user email
     */
    @Transactional(readOnly = true)
    public List<Complaint> getComplaintsByUserEmail(String userEmail) {
        if (userEmail == null || userEmail.trim().isEmpty()) {
            throw new IllegalArgumentException("User email is required");
        }
        if (!EMAIL_PATTERN.matcher(userEmail.trim()).matches()) {
            throw new IllegalArgumentException("Invalid email format");
        }
        return complaintRepository.findByUserEmailIgnoreCaseOrderByCreatedAtDesc(userEmail.trim());
    }
    
    /**
     * Get complaints by status
     */
    @Transactional(readOnly = true)
    public List<Complaint> getComplaintsByStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status is required");
        }
        if (!isValidStatus(status.trim().toUpperCase())) {
            throw new IllegalArgumentException("Invalid status. Must be one of: PENDING, IN_PROGRESS, RESOLVED, CLOSED");
        }
        return complaintRepository.findByStatusIgnoreCaseOrderByCreatedAtDesc(status.trim());
    }
    
    /**
     * Update complaint
     */
    public Complaint updateComplaint(Long id, Complaint updatedComplaint) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid complaint ID");
        }
        
        Optional<Complaint> existingComplaintOpt = complaintRepository.findById(id);
        if (existingComplaintOpt.isEmpty()) {
            throw new IllegalArgumentException("Complaint not found with ID: " + id);
        }
        
        Complaint existingComplaint = existingComplaintOpt.get();
        
        // Validate updated data
        validateComplaint(updatedComplaint);
        
        // Update fields (email cannot be changed for security reasons)
        existingComplaint.setTitle(updatedComplaint.getTitle().trim());
        existingComplaint.setComplaint(updatedComplaint.getComplaint().trim());
        
        // Validate and update status if provided
        if (updatedComplaint.getStatus() != null && !updatedComplaint.getStatus().trim().isEmpty()) {
            String newStatus = updatedComplaint.getStatus().trim().toUpperCase();
            if (!isValidStatus(newStatus)) {
                throw new IllegalArgumentException("Invalid status. Must be one of: PENDING, IN_PROGRESS, RESOLVED, CLOSED");
            }
            existingComplaint.setStatus(newStatus);
        }
        
        return complaintRepository.save(existingComplaint);
    }
    
    /**
     * Update complaint status only
     */
    public Complaint updateComplaintStatus(Long id, String status) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid complaint ID");
        }
        
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status is required");
        }
        
        String normalizedStatus = status.trim().toUpperCase();
        if (!isValidStatus(normalizedStatus)) {
            throw new IllegalArgumentException("Invalid status. Must be one of: PENDING, IN_PROGRESS, RESOLVED, CLOSED");
        }
        
        Optional<Complaint> complaintOpt = complaintRepository.findById(id);
        if (complaintOpt.isEmpty()) {
            throw new IllegalArgumentException("Complaint not found with ID: " + id);
        }
        
        Complaint complaint = complaintOpt.get();
        complaint.setStatus(normalizedStatus);
        
        return complaintRepository.save(complaint);
    }
    
    /**
     * Delete complaint
     */
    public void deleteComplaint(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid complaint ID");
        }
        
        if (!complaintRepository.existsById(id)) {
            throw new IllegalArgumentException("Complaint not found with ID: " + id);
        }
        
        complaintRepository.deleteById(id);
    }
    
    /**
     * Search complaints by keyword in title or description
     */
    @Transactional(readOnly = true)
    public List<Complaint> searchComplaints(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllComplaints();
        }
        
        String searchKeyword = keyword.trim();
        List<Complaint> titleResults = complaintRepository.findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(searchKeyword);
        List<Complaint> descriptionResults = complaintRepository.findByComplaintContainingIgnoreCaseOrderByCreatedAtDesc(searchKeyword);
        
        // Combine results and remove duplicates
        titleResults.addAll(descriptionResults);
        return titleResults.stream().distinct().toList();
    }
    
    /**
     * Get complaints count by status
     */
    @Transactional(readOnly = true)
    public long getComplaintsCountByStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status is required");
        }
        if (!isValidStatus(status.trim().toUpperCase())) {
            throw new IllegalArgumentException("Invalid status");
        }
        return complaintRepository.countByStatusIgnoreCase(status.trim());
    }
    
    /**
     * Get complaints within date range
     */
    @Transactional(readOnly = true)
    public List<Complaint> getComplaintsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Start date and end date are required");
        }
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }
        return complaintRepository.findComplaintsByDateRange(startDate, endDate);
    }
    
    /**
     * Validate complaint data
     */
    private void validateComplaint(Complaint complaint) {
        if (complaint == null) {
            throw new IllegalArgumentException("Complaint cannot be null");
        }
        
        // Validate user email
        if (complaint.getUserEmail() == null || complaint.getUserEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("User email is required");
        }
        if (!EMAIL_PATTERN.matcher(complaint.getUserEmail().trim()).matches()) {
            throw new IllegalArgumentException("Invalid email format");
        }
        if (complaint.getUserEmail().trim().length() > 100) {
            throw new IllegalArgumentException("Email must not exceed 100 characters");
        }
        
        // Validate title
        if (complaint.getTitle() == null || complaint.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Title is required");
        }
        if (complaint.getTitle().trim().length() < 5 || complaint.getTitle().trim().length() > 200) {
            throw new IllegalArgumentException("Title must be between 5 and 200 characters");
        }
        
        // Validate complaint description
        if (complaint.getComplaint() == null || complaint.getComplaint().trim().isEmpty()) {
            throw new IllegalArgumentException("Complaint description is required");
        }
        if (complaint.getComplaint().trim().length() < 10 || complaint.getComplaint().trim().length() > 2000) {
            throw new IllegalArgumentException("Complaint description must be between 10 and 2000 characters");
        }
    }
    
    /**
     * Check if status is valid
     */
    private boolean isValidStatus(String status) {
        if (status == null) return false;
        for (String validStatus : VALID_STATUSES) {
            if (validStatus.equals(status.toUpperCase())) {
                return true;
            }
        }
        return false;
    }
}