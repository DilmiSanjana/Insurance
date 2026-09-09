package com.example.secrud.designpatterns.strategy.impl;

import com.example.secrud.designpatterns.strategy.ProcessingStrategy;
import com.example.secrud.claims.models.ClaimModel;
import java.math.BigDecimal;

public class ClaimValidationStrategy implements ProcessingStrategy<ClaimModel> {
    
    @Override
    public ClaimModel process(ClaimModel claim) {
        if (claim.getClaimAmount() == null) {
            throw new IllegalArgumentException("Claim amount cannot be null");
        }
        
        if (claim.getClaimAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Claim amount must be greater than zero");
        }
        
        if (claim.getStatus() == null) {
            throw new IllegalArgumentException("Claim status is required");
        }
        
        return claim;
    }
    
    @Override
    public String getStrategyType() {
        return "VALIDATION";
    }
}
