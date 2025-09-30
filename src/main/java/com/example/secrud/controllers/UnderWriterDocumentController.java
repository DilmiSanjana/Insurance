package com.example.secrud.controllers;

import com.example.secrud.dto.UnderWriterDocumentRequestDTO;
import com.example.secrud.services.UnderWriterDocumentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/underwriter-documents")
public class UnderWriterDocumentController {

    private final UnderWriterDocumentService service;

    public UnderWriterDocumentController(UnderWriterDocumentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody UnderWriterDocumentRequestDTO request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
        } catch (Exception e) {
            return error("Failed to create document", e, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            return ResponseEntity.ok(service.getAll());
        } catch (Exception e) {
            return error("Failed to fetch documents", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return service.getById(id)
                    .<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(message("Document not found")));
        } catch (Exception e) {
            return error("Failed to fetch document", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UnderWriterDocumentRequestDTO request) {
        try {
            return service.update(id, request)
                    .<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(message("Document not found")));
        } catch (Exception e) {
            return error("Failed to update document", e, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            boolean deleted = service.delete(id);
            if (deleted) return ResponseEntity.noContent().build();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message("Document not found"));
        } catch (Exception e) {
            return error("Failed to delete document", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private ResponseEntity<Map<String, Object>> error(String msg, Exception e, HttpStatus status) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", msg);
        body.put("details", e.getMessage());
        return ResponseEntity.status(status).body(body);
    }

    private Map<String, String> message(String m) {
        Map<String, String> body = new HashMap<>();
        body.put("message", m);
        return body;
    }
}