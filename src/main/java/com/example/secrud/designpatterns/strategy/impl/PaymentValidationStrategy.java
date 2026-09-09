package com.example.secrud.designpatterns.strategy.impl;

import com.example.secrud.designpatterns.strategy.ProcessingStrategy;
import com.example.secrud.payment.models.PaymentModel;
import java.math.BigDecimal;

public class PaymentValidationStrategy implements ProcessingStrategy<PaymentModel> {
    
    @Override
    public PaymentModel process(PaymentModel payment) {
        if (payment.getAmount() == null) {
            throw new IllegalArgumentException("Payment amount cannot be null");
        }
        
        if (payment.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Payment amount must be greater than zero");
        }
        
        if (payment.getUser() == null) {
            throw new IllegalArgumentException("Payment user is required");
        }
        
        return payment;
    }
    
    @Override
    public String getStrategyType() {
        return "VALIDATION";
    }
}
