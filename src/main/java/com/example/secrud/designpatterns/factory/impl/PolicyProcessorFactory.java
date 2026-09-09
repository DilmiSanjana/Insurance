package com.example.secrud.designpatterns.factory.impl;

import com.example.secrud.designpatterns.factory.EntityProcessorFactory;
import com.example.secrud.designpatterns.factory.EntityProcessor;
import com.example.secrud.designpatterns.strategy.ProcessingStrategy;
import com.example.secrud.designpatterns.strategy.impl.PolicyValidationStrategy;
import com.example.secrud.policy.models.PolicyModel;
import org.springframework.stereotype.Component;

@Component
public class PolicyProcessorFactory implements EntityProcessorFactory<PolicyModel> {
    
    @Override
    public EntityProcessor<PolicyModel> createProcessor(String type) {
        return new PolicyEntityProcessor(type);
    }
    
    private static class PolicyEntityProcessor implements EntityProcessor<PolicyModel> {
        private ProcessingStrategy<PolicyModel> strategy;
        
        public PolicyEntityProcessor(String type) {
            switch (type.toUpperCase()) {
                case "VALIDATION":
                    this.strategy = new PolicyValidationStrategy();
                    break;
                default:
                    throw new IllegalArgumentException("Unknown processing type: " + type);
            }
        }
        
        @Override
        public PolicyModel processEntity(PolicyModel entity, String processingType) {
            return strategy.process(entity);
        }
        
        @Override
        public void setStrategy(ProcessingStrategy<PolicyModel> strategy) {
            this.strategy = strategy;
        }
    }
}
