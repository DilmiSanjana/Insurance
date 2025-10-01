package com.example.secrud.controllers;

import com.example.secrud.models.Customer;
import com.example.secrud.services.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody Customer customer) {
        try {
            Customer created = service.create(customer);
            created.setPassword(null);
            return success("Customer created successfully", created, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return error("Validation error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return error("Failed to create customer: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll() {
        try {
            List<Customer> customers = service.getAll();
            customers.forEach(c -> c.setPassword(null));
            return success("Customers retrieved successfully", customers, HttpStatus.OK);
        } catch (Exception e) {
            return error("Failed to retrieve customers: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        try {
            Customer customer = service.getById(id);
            customer.setPassword(null);
            return success("Customer retrieved successfully", customer, HttpStatus.OK);
        } catch (RuntimeException e) {
            return error(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return error("Failed to retrieve customer: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @Valid @RequestBody Customer customer) {
        try {
            Customer updated = service.update(id, customer);
            updated.setPassword(null);
            return success("Customer updated successfully", updated, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return error("Validation error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return error(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return error("Failed to update customer: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return success("Customer deleted successfully", null, HttpStatus.OK);
        } catch (RuntimeException e) {
            return error(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return error("Failed to delete customer: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<Map<String, Object>> authenticate(@RequestBody Map<String, String> payload) {
        try {
            String emailAddress = payload.get("emailAddress");
            String password = payload.get("password");
            Customer customer = service.authenticate(emailAddress, password);
            customer.setPassword(null);
            return success("Authenticated successfully", customer, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return error("Invalid email or password", HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return error("Failed to authenticate: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private ResponseEntity<Map<String, Object>> success(String message, Object data, HttpStatus status) {
        Map<String, Object> body = new HashMap<>();
        body.put("success", true);
        body.put("message", message);
        body.put("data", data);
        body.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.status(status).body(body);
    }

    private ResponseEntity<Map<String, Object>> error(String message, HttpStatus status) {
        Map<String, Object> body = new HashMap<>();
        body.put("success", false);
        body.put("error", message);
        body.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.status(status).body(body);
    }
}