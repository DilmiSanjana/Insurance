package com.example.secrud.claims.services.impl;

import com.example.secrud.claims.models.ClaimModel;
import com.example.secrud.claims.repositories.ClaimRepository;
import com.example.secrud.claims.services.ClaimService;
import com.example.secrud.designpatterns.factory.EntityProcessorFactory;
import com.example.secrud.designpatterns.factory.EntityProcessor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClaimServiceImpl implements ClaimService {

    private final ClaimRepository claimRepository;
    private final EntityProcessorFactory<ClaimModel> claimProcessorFactory;

    public ClaimServiceImpl(ClaimRepository claimRepository, EntityProcessorFactory<ClaimModel> claimProcessorFactory) {
        this.claimRepository = claimRepository;
        this.claimProcessorFactory = claimProcessorFactory;
    }

    @Override
    public ClaimModel createClaim(ClaimModel claim) {
        try {
            return claimRepository.save(claim);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create claim: " + e.getMessage(), e);
        }
    }

    @Override
    public ClaimModel getClaimById(Long id) {
        try {
            return claimRepository.findById(id).orElse(null);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch claim: " + e.getMessage(), e);
        }
    }

    @Override
    public List<ClaimModel> getAllClaims() {
        try {
            return claimRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Failed to list claims: " + e.getMessage(), e);
        }
    }

    @Override
    public ClaimModel updateClaim(Long id, ClaimModel claim) {
        try {
            ClaimModel existing = claimRepository.findById(id).orElse(null);
            if (existing == null) {
                throw new RuntimeException("Claim not found");
            }
            existing.setClaimAmount(claim.getClaimAmount());
            existing.setUserEmail(claim.getUserEmail());
            existing.setStatus(claim.getStatus());
            existing.setDateFilled(claim.getDateFilled());

            if (claim.getClaimId() != null) {
                existing.setClaimId(claim.getClaimId());
            }
            if (claim.getType() != null) {
                existing.setType(claim.getType());
            }
            return claimRepository.save(existing);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update claim: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<ClaimModel> getClaimByClaimId(String claimId) {
        try {
            return claimRepository.findByClaimId(claimId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch claim by claimId: " + e.getMessage(), e);
        }
    }

    @Override
    public List<ClaimModel> getClaimsByType(ClaimModel.ClaimType type) {
        try {
            return claimRepository.findByType(type);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch claims by type: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean existsByClaimId(String claimId) {
        try {
            return claimRepository.existsByClaimId(claimId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to check if claim exists: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteClaim(Long id) {
        try {
            claimRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete claim: " + e.getMessage(), e);
        }
    }

    @Override
    public ClaimModel processClaimWithPattern(ClaimModel claim, String processingType) {
        try {
            EntityProcessor<ClaimModel> processor = claimProcessorFactory.createProcessor(processingType);
            return processor.processEntity(claim, processingType);
        } catch (Exception e) {
            throw new RuntimeException("Failed to process claim with pattern: " + e.getMessage(), e);
        }
    }
}