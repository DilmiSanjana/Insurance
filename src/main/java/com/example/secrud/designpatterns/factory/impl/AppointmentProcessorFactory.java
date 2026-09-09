package com.example.secrud.designpatterns.factory.impl;

import com.example.secrud.designpatterns.factory.EntityProcessorFactory;
import com.example.secrud.designpatterns.factory.EntityProcessor;
import com.example.secrud.designpatterns.strategy.ProcessingStrategy;
import com.example.secrud.designpatterns.strategy.impl.AppointmentValidationStrategy;
import com.example.secrud.designpatterns.strategy.impl.AppointmentEnrichmentStrategy;
import com.example.secrud.appointment.models.AppointmentModel;
import org.springframework.stereotype.Component;

@Component
public class AppointmentProcessorFactory implements EntityProcessorFactory<AppointmentModel> {
    
    @Override
    public EntityProcessor<AppointmentModel> createProcessor(String type) {
        return new AppointmentEntityProcessor(type);
    }
    
    private static class AppointmentEntityProcessor implements EntityProcessor<AppointmentModel> {
        private ProcessingStrategy<AppointmentModel> strategy;
        
        public AppointmentEntityProcessor(String type) {
            switch (type.toUpperCase()) {
                case "VALIDATION":
                    this.strategy = new AppointmentValidationStrategy();
                    break;
                case "ENRICHMENT":
                    this.strategy = new AppointmentEnrichmentStrategy();
                    break;
                default:
                    throw new IllegalArgumentException("Unknown processing type: " + type);
            }
        }
        
        @Override
        public AppointmentModel processEntity(AppointmentModel entity, String processingType) {
            return strategy.process(entity);
        }
        
        @Override
        public void setStrategy(ProcessingStrategy<AppointmentModel> strategy) {
            this.strategy = strategy;
        }
    }
}
