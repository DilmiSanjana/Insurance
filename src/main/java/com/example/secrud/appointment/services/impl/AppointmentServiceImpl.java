package com.example.secrud.appointment.services.impl;

import com.example.secrud.appointment.models.AppointmentModel;
import com.example.secrud.appointment.models.AppointmentStatus;
import com.example.secrud.appointment.repositories.AppointmentRepository;
import com.example.secrud.appointment.services.AppointmentService;
import com.example.secrud.designpatterns.factory.EntityProcessorFactory;
import com.example.secrud.designpatterns.factory.EntityProcessor;
import com.example.secrud.user.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private EntityProcessorFactory<AppointmentModel> appointmentProcessorFactory;

    @Override
    public AppointmentModel createAppointment(AppointmentModel appointment) {
        try {
            if (appointment.getStatus() == null) {
                appointment.setStatus(AppointmentStatus.PENDING);
            }
            return appointmentRepository.save(appointment);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create appointment: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AppointmentModel> getAppointmentById(Long id) {
        try {
            return appointmentRepository.findById(id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch appointment with id: " + id + " - " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentModel> getAllAppointments() {
        try {
            return appointmentRepository.findAllOrderByCreatedAtDesc();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch all appointments: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentModel> getAppointmentsByStatus(AppointmentStatus status) {
        try {
            return appointmentRepository.findByStatus(status);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch appointments by status: " + status + " - " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentModel> getAppointmentsByUser(User user) {
        try {
            return appointmentRepository.findByUser(user);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch appointments for user: " + user.getId() + " - " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentModel> getAppointmentsByUserId(Long userId) {
        try {
            return appointmentRepository.findByUserIdOrderByCreatedAtDesc(userId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch appointments for user ID: " + userId + " - " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentModel> getAppointmentsByUserAndStatus(User user, AppointmentStatus status) {
        try {
            return appointmentRepository.findByUserAndStatus(user, status);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch appointments for user: " + user.getId() + " with status: " + status + " - " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentModel> getAppointmentsByDoctorName(String doctorName) {
        try {
            return appointmentRepository.findByDoctorName(doctorName);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch appointments for doctor: " + doctorName + " - " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentModel> getAppointmentsByDoctorNameAndStatus(String doctorName, AppointmentStatus status) {
        try {
            return appointmentRepository.findByDoctorNameAndStatus(doctorName, status);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch appointments for doctor: " + doctorName + " with status: " + status + " - " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentModel> getAppointmentsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        try {
            return appointmentRepository.findByAppointedDateBetween(startDate, endDate);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch appointments by date range: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentModel> getUpcomingAppointments() {
        try {
            return appointmentRepository.findUpcomingAppointments(LocalDateTime.now());
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch upcoming appointments: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentModel> getPastAppointments() {
        try {
            return appointmentRepository.findPastAppointments(LocalDateTime.now());
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch past appointments: " + e.getMessage(), e);
        }
    }

    @Override
    public AppointmentModel updateAppointment(AppointmentModel appointment) {
        try {
            return appointmentRepository.save(appointment);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update appointment: " + e.getMessage(), e);
        }
    }

    @Override
    public AppointmentModel updateAppointmentStatus(Long appointmentId, AppointmentStatus status) {
        try {
            AppointmentModel appointment = appointmentRepository.findById(appointmentId)
                    .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + appointmentId));
            
            appointment.setStatus(status);
            return appointmentRepository.save(appointment);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to update appointment status: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteAppointment(Long id) {
        try {
            if (!appointmentRepository.existsById(id)) {
                throw new RuntimeException("Appointment not found with id: " + id);
            }
            appointmentRepository.deleteById(id);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete appointment: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Long getAppointmentCountByStatus(AppointmentStatus status) {
        try {
            return appointmentRepository.countByStatus(status);
        } catch (Exception e) {
            throw new RuntimeException("Failed to count appointments by status: " + status + " - " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Long getAppointmentCountByDoctorNameAndStatus(String doctorName, AppointmentStatus status) {
        try {
            return appointmentRepository.countByDoctorNameAndStatus(doctorName, status);
        } catch (Exception e) {
            throw new RuntimeException("Failed to count appointments for doctor: " + doctorName + " with status: " + status + " - " + e.getMessage(), e);
        }
    }

    @Override
    public AppointmentModel acceptAppointment(Long appointmentId) {
        try {
            return updateAppointmentStatus(appointmentId, AppointmentStatus.ACCEPTED);
        } catch (Exception e) {
            throw new RuntimeException("Failed to accept appointment: " + e.getMessage(), e);
        }
    }

    @Override
    public AppointmentModel rejectAppointment(Long appointmentId) {
        try {
            return updateAppointmentStatus(appointmentId, AppointmentStatus.REJECTED);
        } catch (Exception e) {
            throw new RuntimeException("Failed to reject appointment: " + e.getMessage(), e);
        }
    }

    @Override
    public AppointmentModel processAppointmentWithPattern(AppointmentModel appointment, String processingType) {
        try {
            EntityProcessor<AppointmentModel> processor = appointmentProcessorFactory.createProcessor(processingType);
            return processor.processEntity(appointment, processingType);
        } catch (Exception e) {
            throw new RuntimeException("Failed to process appointment with pattern: " + e.getMessage(), e);
        }
    }
}
