package com.example.secrud.appointment.service;

import com.example.secrud.appointment.model.Appointment;
import com.example.secrud.appointment.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    private final AppointmentRepository repository;

    public AppointmentService(AppointmentRepository repository) {
        this.repository = repository;
    }

    public Appointment create(Appointment appointment) {
        try {
            return repository.save(appointment);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create appointment: " + e.getMessage(), e);
        }
    }

    public List<Appointment> findAll() {
        try {
            return repository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch appointments: " + e.getMessage(), e);
        }
    }

    public Optional<Appointment> findById(Long id) {
        try {
            return repository.findById(id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch appointment: " + e.getMessage(), e);
        }
    }

    public Optional<Appointment> update(Long id, Appointment updates) {
        try {
            return repository.findById(id).map(existing -> {
                existing.setPatientName(updates.getPatientName());
                existing.setContactNumber(updates.getContactNumber());
                existing.setEmail(updates.getEmail());
                existing.setDate(updates.getDate());
                existing.setTime(updates.getTime());
                existing.setDoctorName(updates.getDoctorName());
                return repository.save(existing);
            });
        } catch (Exception e) {
            throw new RuntimeException("Failed to update appointment: " + e.getMessage(), e);
        }
    }

    public boolean delete(Long id) {
        try {
            if (repository.existsById(id)) {
                repository.deleteById(id);
                return true;
            }
            return false;
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete appointment: " + e.getMessage(), e);
        }
    }
}