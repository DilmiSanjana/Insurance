package com.example.secrud.designpatterns.strategy.impl;

import com.example.secrud.designpatterns.strategy.ProcessingStrategy;
import com.example.secrud.appointment.models.AppointmentModel;
import java.time.LocalDateTime;

public class AppointmentEnrichmentStrategy implements ProcessingStrategy<AppointmentModel> {
    
    @Override
    public AppointmentModel process(AppointmentModel appointment) {
        if (appointment.getCreatedAt() == null) {
            appointment.setCreatedAt(LocalDateTime.now());
        }
        
        appointment.setUpdatedAt(LocalDateTime.now());
        
        if (appointment.getDescription() == null) {
            appointment.setDescription("No additional description provided");
        }
        
        return appointment;
    }
    
    @Override
    public String getStrategyType() {
        return "ENRICHMENT";
    }
}
