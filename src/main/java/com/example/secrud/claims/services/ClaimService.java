package com.example.secrud.claims.services;

import com.example.secrud.claims.models.ClaimModel;

import java.util.List;
import java.util.Optional;

public interface ClaimService {
    ClaimModel createClaim(ClaimModel claim);
    ClaimModel getClaimById(Long id);
    Optional<ClaimModel> getClaimByClaimId(String claimId);
    List<ClaimModel> getAllClaims();
    List<ClaimModel> getClaimsByType(ClaimModel.ClaimType type);
    ClaimModel updateClaim(Long id, ClaimModel claim);
    void deleteClaim(Long id);
    boolean existsByClaimId(String claimId);
    ClaimModel processClaimWithPattern(ClaimModel claim, String processingType);
}
