package com.example.secrud.appointment.controller;

import com.example.secrud.appointment.model.Appointment;
import com.example.secrud.appointment.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, boolean success, String message, Object data) {
        Map<String, Object> body = new HashMap<>();
        body.put("success", success);
        body.put("message", message);
        if (data != null) {
            body.put("data", data);
        }
        return new ResponseEntity<>(body, status);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody Appointment appointment) {
        try {
            Appointment created = service.create(appointment);
            return buildResponse(HttpStatus.CREATED, true, "Appointment created successfully", created);
        } catch (Exception e) {
            return buildResponse(HttpStatus.BAD_REQUEST, false, e.getMessage(), null);
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll() {
        try {
            List<Appointment> list = service.findAll();
            return buildResponse(HttpStatus.OK, true, "Appointments fetched", list);
        } catch (Exception e) {
            return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, false, e.getMessage(), null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        try {
            Optional<Appointment> maybe = service.findById(id);
            if (maybe.isPresent()) {
                return buildResponse(HttpStatus.OK, true, "Appointment fetched", maybe.get());
            }
            return buildResponse(HttpStatus.NOT_FOUND, false, "Appointment not found", null);
        } catch (Exception e) {
            return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, false, e.getMessage(), null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @Valid @RequestBody Appointment updates) {
        try {
            Optional<Appointment> updated = service.update(id, updates);
            if (updated.isPresent()) {
                return buildResponse(HttpStatus.OK, true, "Appointment updated successfully", updated.get());
            }
            return buildResponse(HttpStatus.NOT_FOUND, false, "Appointment not found", null);
        } catch (Exception e) {
            return buildResponse(HttpStatus.BAD_REQUEST, false, e.getMessage(), null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        try {
            boolean deleted = service.delete(id);
            if (deleted) {
                return buildResponse(HttpStatus.OK, true, "Appointment deleted successfully", null);
            }
            return buildResponse(HttpStatus.NOT_FOUND, false, "Appointment not found", null);
        } catch (Exception e) {
            return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, false, e.getMessage(), null);
        }
    }
}