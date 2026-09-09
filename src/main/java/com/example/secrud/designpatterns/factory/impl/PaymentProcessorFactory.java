package com.example.secrud.designpatterns.factory.impl;

import com.example.secrud.designpatterns.factory.EntityProcessorFactory;
import com.example.secrud.designpatterns.factory.EntityProcessor;
import com.example.secrud.designpatterns.strategy.ProcessingStrategy;
import com.example.secrud.designpatterns.strategy.impl.PaymentValidationStrategy;
import com.example.secrud.payment.models.PaymentModel;
import org.springframework.stereotype.Component;

@Component
public class PaymentProcessorFactory implements EntityProcessorFactory<PaymentModel> {
    
    @Override
    public EntityProcessor<PaymentModel> createProcessor(String type) {
        return new PaymentEntityProcessor(type);
    }
    
    private static class PaymentEntityProcessor implements EntityProcessor<PaymentModel> {
        private ProcessingStrategy<PaymentModel> strategy;
        
        public PaymentEntityProcessor(String type) {
            switch (type.toUpperCase()) {
                case "VALIDATION":
                    this.strategy = new PaymentValidationStrategy();
                    break;
                default:
                    throw new IllegalArgumentException("Unknown processing type: " + type);
            }
        }
        
        @Override
        public PaymentModel processEntity(PaymentModel entity, String processingType) {
            return strategy.process(entity);
        }
        
        @Override
        public void setStrategy(ProcessingStrategy<PaymentModel> strategy) {
            this.strategy = strategy;
        }
    }
}
