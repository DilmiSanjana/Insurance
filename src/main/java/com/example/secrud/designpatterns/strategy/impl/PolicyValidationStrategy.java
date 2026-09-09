package com.example.secrud.designpatterns.strategy.impl;

import com.example.secrud.designpatterns.strategy.ProcessingStrategy;
import com.example.secrud.policy.models.PolicyModel;

public class PolicyValidationStrategy implements ProcessingStrategy<PolicyModel> {
    
    @Override
    public PolicyModel process(PolicyModel policy) {
        if (policy.getPolicyIdentificationNumber() == null || policy.getPolicyIdentificationNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Policy identification number is required");
        }
        
        if (policy.getPolicyTitle() == null || policy.getPolicyTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Policy title is required");
        }
        
        if (policy.getActiveStatus() == null) {
            throw new IllegalArgumentException("Policy active status is required");
        }
        
        return policy;
    }
    
    @Override
    public String getStrategyType() {
        return "VALIDATION";
    }
}
