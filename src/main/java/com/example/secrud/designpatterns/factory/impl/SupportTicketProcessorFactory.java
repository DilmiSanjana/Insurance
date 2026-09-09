package com.example.secrud.designpatterns.factory.impl;

import com.example.secrud.designpatterns.factory.EntityProcessorFactory;
import com.example.secrud.designpatterns.factory.EntityProcessor;
import com.example.secrud.designpatterns.strategy.ProcessingStrategy;
import com.example.secrud.designpatterns.strategy.impl.SupportTicketValidationStrategy;
import com.example.secrud.support_ticket.models.CustomerSupportTicket;
import org.springframework.stereotype.Component;

@Component
public class SupportTicketProcessorFactory implements EntityProcessorFactory<CustomerSupportTicket> {
    
    @Override
    public EntityProcessor<CustomerSupportTicket> createProcessor(String type) {
        return new SupportTicketEntityProcessor(type);
    }
    
    private static class SupportTicketEntityProcessor implements EntityProcessor<CustomerSupportTicket> {
        private ProcessingStrategy<CustomerSupportTicket> strategy;
        
        public SupportTicketEntityProcessor(String type) {
            switch (type.toUpperCase()) {
                case "VALIDATION":
                    this.strategy = new SupportTicketValidationStrategy();
                    break;
                default:
                    throw new IllegalArgumentException("Unknown processing type: " + type);
            }
        }
        
        @Override
        public CustomerSupportTicket processEntity(CustomerSupportTicket entity, String processingType) {
            return strategy.process(entity);
        }
        
        @Override
        public void setStrategy(ProcessingStrategy<CustomerSupportTicket> strategy) {
            this.strategy = strategy;
        }
    }
}
