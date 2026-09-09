package com.example.secrud.designpatterns.factory.impl;

import com.example.secrud.designpatterns.factory.EntityProcessorFactory;
import com.example.secrud.designpatterns.factory.EntityProcessor;
import com.example.secrud.designpatterns.strategy.ProcessingStrategy;
import com.example.secrud.designpatterns.strategy.impl.UserValidationStrategy;
import com.example.secrud.user.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserProcessorFactory implements EntityProcessorFactory<User> {
    
    @Override
    public EntityProcessor<User> createProcessor(String type) {
        return new UserEntityProcessor(type);
    }
    
    private static class UserEntityProcessor implements EntityProcessor<User> {
        private ProcessingStrategy<User> strategy;
        
        public UserEntityProcessor(String type) {
            switch (type.toUpperCase()) {
                case "VALIDATION":
                    this.strategy = new UserValidationStrategy();
                    break;
                default:
                    throw new IllegalArgumentException("Unknown processing type: " + type);
            }
        }
        
        @Override
        public User processEntity(User entity, String processingType) {
            return strategy.process(entity);
        }
        
        @Override
        public void setStrategy(ProcessingStrategy<User> strategy) {
            this.strategy = strategy;
        }
    }
}
