package com.example.secrud.claims.controllers;

import com.example.secrud.claims.models.ClaimModel;
import com.example.secrud.claims.services.ClaimService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }
    public static String generateRandomCLId() {
        final String PREFIX = "CL";

        Random random = new Random();

        int randomNumber = random.nextInt(100000);

        String formattedNumber = String.format("%05d", randomNumber);

        return PREFIX + formattedNumber;
    }
    @PostMapping
    public ResponseEntity<?> create(@RequestBody ClaimModel payload) {
        try {
            payload.setClaimId(generateRandomCLId());
            ClaimModel created = claimService.createClaim(payload);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return error(e);
        }
    }

    @GetMapping
    public ResponseEntity<?> list() {
        try {
            List<ClaimModel> claims = claimService.getAllClaims();
            return ResponseEntity.ok(claims);
        } catch (Exception e) {
            return error(e);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id) {
        try {
            ClaimModel claim = claimService.getClaimById(id);
            if (claim == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Claim not found"));
            }
            return ResponseEntity.ok(claim);
        } catch (Exception e) {
            return error(e);
        }
    }

    @GetMapping("/claim-id/{claimId}")
    public ResponseEntity<?> getByClaimId(@PathVariable String claimId) {
        try {
            Optional<ClaimModel> claimOpt = claimService.getClaimByClaimId(claimId);
            if (claimOpt.isPresent()) {
                return ResponseEntity.ok(claimOpt.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Claim not found with claimId: " + claimId));
            }
        } catch (Exception e) {
            return error(e);
        }
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<?> getByType(@PathVariable ClaimModel.ClaimType type) {
        try {
            List<ClaimModel> claims = claimService.getClaimsByType(type);
            return ResponseEntity.ok(claims);
        } catch (Exception e) {
            return error(e);
        }
    }

    @GetMapping("/exists/{claimId}")
    public ResponseEntity<?> existsByClaimId(@PathVariable String claimId) {
        try {
            boolean exists = claimService.existsByClaimId(claimId);
            return ResponseEntity.ok(Map.of("exists", exists));
        } catch (Exception e) {
            return error(e);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody ClaimModel payload) {
        try {
            ClaimModel updated = claimService.updateClaim(id, payload);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return error(e);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            claimService.deleteClaim(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return error(e);
        }
    }

    @PostMapping("/process")
    public ResponseEntity<?> processClaimWithPattern(@RequestBody ClaimModel claim,
                                                    @RequestParam String processingType) {
        try {
            ClaimModel processedClaim = claimService.processClaimWithPattern(claim, processingType);
            return ResponseEntity.ok(processedClaim);
        } catch (Exception e) {
            return error(e);
        }
    }

    private ResponseEntity<Map<String, String>> error(Exception e) {
        Map<String, String> body = new HashMap<>();
        body.put("error", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}