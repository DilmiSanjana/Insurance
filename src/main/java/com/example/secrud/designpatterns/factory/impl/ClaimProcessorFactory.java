package com.example.secrud.designpatterns.factory.impl;

import com.example.secrud.designpatterns.factory.EntityProcessorFactory;
import com.example.secrud.designpatterns.factory.EntityProcessor;
import com.example.secrud.designpatterns.strategy.ProcessingStrategy;
import com.example.secrud.designpatterns.strategy.impl.ClaimValidationStrategy;
import com.example.secrud.claims.models.ClaimModel;
import org.springframework.stereotype.Component;

@Component
public class ClaimProcessorFactory implements EntityProcessorFactory<ClaimModel> {
    
    @Override
    public EntityProcessor<ClaimModel> createProcessor(String type) {
        return new ClaimEntityProcessor(type);
    }
    
    private static class ClaimEntityProcessor implements EntityProcessor<ClaimModel> {
        private ProcessingStrategy<ClaimModel> strategy;
        
        public ClaimEntityProcessor(String type) {
            switch (type.toUpperCase()) {
                case "VALIDATION":
                    this.strategy = new ClaimValidationStrategy();
                    break;
                default:
                    throw new IllegalArgumentException("Unknown processing type: " + type);
            }
        }
        
        @Override
        public ClaimModel processEntity(ClaimModel entity, String processingType) {
            return strategy.process(entity);
        }
        
        @Override
        public void setStrategy(ProcessingStrategy<ClaimModel> strategy) {
            this.strategy = strategy;
        }
    }
}
