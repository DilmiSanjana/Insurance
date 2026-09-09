package com.example.secrud.designpatterns.strategy.impl;

import com.example.secrud.designpatterns.strategy.ProcessingStrategy;
import com.example.secrud.appointment.models.AppointmentModel;
import java.time.LocalDateTime;

public class AppointmentValidationStrategy implements ProcessingStrategy<AppointmentModel> {
    
    @Override
    public AppointmentModel process(AppointmentModel appointment) {
        if (appointment.getAppointedDate() == null) {
            throw new IllegalArgumentException("Appointment date cannot be null");
        }
        
        if (appointment.getAppointedDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Appointment date cannot be in the past");
        }
        
        if (appointment.getDoctorName() == null || appointment.getDoctorName().trim().isEmpty()) {
            throw new IllegalArgumentException("Doctor name is required");
        }
        
        if (appointment.getReason() == null || appointment.getReason().trim().isEmpty()) {
            throw new IllegalArgumentException("Reason is required");
        }
        
        return appointment;
    }
    
    @Override
    public String getStrategyType() {
        return "VALIDATION";
    }
}
