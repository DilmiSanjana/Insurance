package com.example.secrud.policy.controllers;

import com.example.secrud.policy.models.PolicyModel;
import com.example.secrud.policy.services.PolicyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/policies")
public class PolicyController {

    private final PolicyService policyService;

    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<PolicyModel> policies = policyService.getAll();
            return ResponseEntity.ok(policies);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching policies: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            Optional<PolicyModel> policy = policyService.getById(id);
            return policy.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching policy: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody PolicyModel policy) {
        try {
            PolicyModel saved = policyService.create(policy);
            return ResponseEntity.status(201).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating policy: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody PolicyModel updated) {
        try {
            Optional<PolicyModel> policy = policyService.update(id, updated);
            return policy.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating policy: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            policyService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting policy: " + e.getMessage());
        }
    }
}
