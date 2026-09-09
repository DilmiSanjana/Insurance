package com.example.secrud.appointment.services;

import com.example.secrud.appointment.models.AppointmentModel;
import com.example.secrud.appointment.models.AppointmentStatus;
import com.example.secrud.user.model.User;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentService {

    AppointmentModel createAppointment(AppointmentModel appointment);

    Optional<AppointmentModel> getAppointmentById(Long id);

    List<AppointmentModel> getAllAppointments();

    List<AppointmentModel> getAppointmentsByStatus(AppointmentStatus status);

    List<AppointmentModel> getAppointmentsByUser(User user);

    List<AppointmentModel> getAppointmentsByUserId(Long userId);

    List<AppointmentModel> getAppointmentsByUserAndStatus(User user, AppointmentStatus status);

    List<AppointmentModel> getAppointmentsByDoctorName(String doctorName);

    List<AppointmentModel> getAppointmentsByDoctorNameAndStatus(String doctorName, AppointmentStatus status);

    List<AppointmentModel> getAppointmentsByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    List<AppointmentModel> getUpcomingAppointments();

    List<AppointmentModel> getPastAppointments();

    AppointmentModel updateAppointment(AppointmentModel appointment);

    AppointmentModel updateAppointmentStatus(Long appointmentId, AppointmentStatus status);

    void deleteAppointment(Long id);

    Long getAppointmentCountByStatus(AppointmentStatus status);

    Long getAppointmentCountByDoctorNameAndStatus(String doctorName, AppointmentStatus status);

    AppointmentModel acceptAppointment(Long appointmentId);

    AppointmentModel rejectAppointment(Long appointmentId);

    AppointmentModel processAppointmentWithPattern(AppointmentModel appointment, String processingType);
}
