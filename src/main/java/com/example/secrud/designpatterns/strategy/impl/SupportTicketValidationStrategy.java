package com.example.secrud.designpatterns.strategy.impl;

import com.example.secrud.designpatterns.strategy.ProcessingStrategy;
import com.example.secrud.support_ticket.models.CustomerSupportTicket;

public class SupportTicketValidationStrategy implements ProcessingStrategy<CustomerSupportTicket> {
    
    @Override
    public CustomerSupportTicket process(CustomerSupportTicket ticket) {
        if (ticket.getTitle() == null || ticket.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Support ticket title is required");
        }
        
        if (ticket.getDescription() == null || ticket.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Support ticket description is required");
        }
        
        if (ticket.getCustomerEmail() == null || ticket.getCustomerEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Customer email is required");
        }
        
        return ticket;
    }
    
    @Override
    public String getStrategyType() {
        return "VALIDATION";
    }
}
