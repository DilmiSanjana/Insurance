package com.example.secrud.controllers;

import com.example.secrud.models.Complaint;
import com.example.secrud.services.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*") 
public class ComplaintController {
    
    private final ComplaintService complaintService;
    
    @Autowired
    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }
    
    /**
     * Create a new complaint
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createComplaint(@Valid @RequestBody Complaint complaint) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Complaint createdComplaint = complaintService.createComplaint(complaint);
            response.put("success", true);
            response.put("message", "Complaint created successfully");
            response.put("data", createdComplaint);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred while creating the complaint");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Get all complaints
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllComplaints() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Complaint> complaints = complaintService.getAllComplaints();
            response.put("success", true);
            response.put("message", "Complaints retrieved successfully");
            response.put("data", complaints);
            response.put("count", complaints.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred while retrieving complaints");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Get complaint by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getComplaintById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<Complaint> complaint = complaintService.getComplaintById(id);
            
            if (complaint.isPresent()) {
                response.put("success", true);
                response.put("message", "Complaint retrieved successfully");
                response.put("data", complaint.get());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Complaint not found with ID: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred while retrieving the complaint");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Get complaints by user email
     */
    @GetMapping("/user/{email}")
    public ResponseEntity<Map<String, Object>> getComplaintsByUserEmail(@PathVariable String email) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Complaint> complaints = complaintService.getComplaintsByUserEmail(email);
            response.put("success", true);
            response.put("message", "Complaints retrieved successfully for user: " + email);
            response.put("data", complaints);
            response.put("count", complaints.size());
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred while retrieving complaints for user");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Get complaints by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<Map<String, Object>> getComplaintsByStatus(@PathVariable String status) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Complaint> complaints = complaintService.getComplaintsByStatus(status);
            response.put("success", true);
            response.put("message", "Complaints retrieved successfully for status: " + status);
            response.put("data", complaints);
            response.put("count", complaints.size());
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred while retrieving complaints by status");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Search complaints by keyword
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchComplaints(@RequestParam(required = false) String keyword) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Complaint> complaints = complaintService.searchComplaints(keyword);
            response.put("success", true);
            response.put("message", "Search completed successfully");
            response.put("data", complaints);
            response.put("count", complaints.size());
            response.put("keyword", keyword);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred while searching complaints");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Get complaints within date range
     */
    @GetMapping("/date-range")
    public ResponseEntity<Map<String, Object>> getComplaintsByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
            LocalDateTime start = LocalDateTime.parse(startDate, formatter);
            LocalDateTime end = LocalDateTime.parse(endDate, formatter);
            
            List<Complaint> complaints = complaintService.getComplaintsByDateRange(start, end);
            response.put("success", true);
            response.put("message", "Complaints retrieved successfully for date range");
            response.put("data", complaints);
            response.put("count", complaints.size());
            response.put("startDate", startDate);
            response.put("endDate", endDate);
            return ResponseEntity.ok(response);
            
        } catch (DateTimeParseException e) {
            response.put("success", false);
            response.put("message", "Invalid date format. Use yyyy-MM-dd'T'HH:mm:ss format");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred while retrieving complaints by date range");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Update complaint
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateComplaint(
            @PathVariable Long id, 
            @Valid @RequestBody Complaint complaint) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Complaint updatedComplaint = complaintService.updateComplaint(id, complaint);
            response.put("success", true);
            response.put("message", "Complaint updated successfully");
            response.put("data", updatedComplaint);
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred while updating the complaint");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Update complaint status only
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateComplaintStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> statusUpdate) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String status = statusUpdate.get("status");
            if (status == null) {
                response.put("success", false);
                response.put("message", "Status field is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            Complaint updatedComplaint = complaintService.updateComplaintStatus(id, status);
            response.put("success", true);
            response.put("message", "Complaint status updated successfully");
            response.put("data", updatedComplaint);
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred while updating complaint status");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Delete complaint
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteComplaint(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            complaintService.deleteComplaint(id);
            response.put("success", true);
            response.put("message", "Complaint deleted successfully");
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred while deleting the complaint");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Get complaints count by status
     */
    @GetMapping("/count/status/{status}")
    public ResponseEntity<Map<String, Object>> getComplaintsCountByStatus(@PathVariable String status) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            long count = complaintService.getComplaintsCountByStatus(status);
            response.put("success", true);
            response.put("message", "Count retrieved successfully");
            response.put("status", status);
            response.put("count", count);
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred while retrieving count");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}