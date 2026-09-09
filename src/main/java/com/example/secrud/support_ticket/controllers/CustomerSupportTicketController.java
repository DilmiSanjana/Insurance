package com.example.secrud.support_ticket.controllers;




import com.example.secrud.support_ticket.models.CustomerSupportTicket;
import com.example.secrud.support_ticket.services.CustomerSupportTicketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/support-tickets")
public class CustomerSupportTicketController {

    private final CustomerSupportTicketService service;

    public CustomerSupportTicketController(CustomerSupportTicketService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CustomerSupportTicket ticket) {
        try {
            CustomerSupportTicket created = service.create(ticket);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return error("Failed to create ticket", e, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<CustomerSupportTicket> tickets = service.getAll();
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            return error("Failed to fetch tickets", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            Optional<CustomerSupportTicket> ticket = service.getById(id);
            return ticket.<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(message("Ticket not found")));
        } catch (Exception e) {
            return error("Failed to fetch ticket", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody CustomerSupportTicket updated) {
        try {
            Optional<CustomerSupportTicket> saved = service.update(id, updated);
            return saved.<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(message("Ticket not found")));
        } catch (Exception e) {
            return error("Failed to update ticket", e, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            boolean deleted = service.delete(id);
            if (deleted) return ResponseEntity.noContent().build();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message("Ticket not found"));
        } catch (Exception e) {
            return error("Failed to delete ticket", e, HttpStatus.INTERNAL_SERVER_ERROR);
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
