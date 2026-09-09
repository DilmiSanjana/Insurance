package com.example.secrud.appointment.controllers;

import com.example.secrud.appointment.models.AppointmentModel;
import com.example.secrud.appointment.models.AppointmentStatus;
import com.example.secrud.appointment.services.AppointmentService;
import com.example.secrud.appointment.dto.CreateAppointmentRequest;
import com.example.secrud.appointment.dto.UpdateAppointmentRequest;
import com.example.secrud.appointment.dto.AppointmentResponseDto;
import com.example.secrud.user.model.User;
import com.example.secrud.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody CreateAppointmentRequest request) {
        try {
            Optional<User> user = userService.getById(request.getUserId());
            if (user.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("User not found with id: " + request.getUserId());
            }

            AppointmentModel appointment = new AppointmentModel();
            appointment.setDoctorName(request.getDoctorName());
            appointment.setReason(request.getReason());
            appointment.setDescription(request.getDescription());
            appointment.setAppointedDate(request.getAppointedDate());
            appointment.setUser(user.get());

            AppointmentModel createdAppointment = appointmentService.createAppointment(appointment);
            AppointmentResponseDto responseDto = convertToResponseDto(createdAppointment);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error creating appointment: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointmentById(@PathVariable Long id) {
        try {
            Optional<AppointmentModel> appointment = appointmentService.getAppointmentById(id);
            if (appointment.isPresent()) {
                return ResponseEntity.ok(convertToResponseDto(appointment.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching appointment: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllAppointments() {
        try {
            List<AppointmentModel> appointments = appointmentService.getAllAppointments();
            List<AppointmentResponseDto> responseDtos = appointments.stream()
                    .map(this::convertToResponseDto)
                    .toList();
            return ResponseEntity.ok(responseDtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching appointments: " + e.getMessage());
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getAppointmentsByStatus(@PathVariable AppointmentStatus status) {
        try {
            List<AppointmentModel> appointments = appointmentService.getAppointmentsByStatus(status);
            List<AppointmentResponseDto> responseDtos = appointments.stream()
                    .map(this::convertToResponseDto)
                    .toList();
            return ResponseEntity.ok(responseDtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching appointments by status: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getAppointmentsByUserId(@PathVariable Long userId) {
        try {
            List<AppointmentModel> appointments = appointmentService.getAppointmentsByUserId(userId);
            List<AppointmentResponseDto> responseDtos = appointments.stream()
                    .map(this::convertToResponseDto)
                    .toList();
            return ResponseEntity.ok(responseDtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching appointments for user: " + e.getMessage());
        }
    }

    @GetMapping("/doctor/{doctorName}")
    public ResponseEntity<?> getAppointmentsByDoctorName(@PathVariable String doctorName) {
        try {
            List<AppointmentModel> appointments = appointmentService.getAppointmentsByDoctorName(doctorName);
            List<AppointmentResponseDto> responseDtos = appointments.stream()
                    .map(this::convertToResponseDto)
                    .toList();
            return ResponseEntity.ok(responseDtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching appointments for doctor: " + e.getMessage());
        }
    }

    @GetMapping("/doctor/{doctorName}/status/{status}")
    public ResponseEntity<?> getAppointmentsByDoctorNameAndStatus(@PathVariable String doctorName, 
                                                                @PathVariable AppointmentStatus status) {
        try {
            List<AppointmentModel> appointments = appointmentService.getAppointmentsByDoctorNameAndStatus(doctorName, status);
            List<AppointmentResponseDto> responseDtos = appointments.stream()
                    .map(this::convertToResponseDto)
                    .toList();
            return ResponseEntity.ok(responseDtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching appointments for doctor with status: " + e.getMessage());
        }
    }

    @GetMapping("/upcoming")
    public ResponseEntity<?> getUpcomingAppointments() {
        try {
            List<AppointmentModel> appointments = appointmentService.getUpcomingAppointments();
            List<AppointmentResponseDto> responseDtos = appointments.stream()
                    .map(this::convertToResponseDto)
                    .toList();
            return ResponseEntity.ok(responseDtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching upcoming appointments: " + e.getMessage());
        }
    }

    @GetMapping("/past")
    public ResponseEntity<?> getPastAppointments() {
        try {
            List<AppointmentModel> appointments = appointmentService.getPastAppointments();
            List<AppointmentResponseDto> responseDtos = appointments.stream()
                    .map(this::convertToResponseDto)
                    .toList();
            return ResponseEntity.ok(responseDtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching past appointments: " + e.getMessage());
        }
    }

    @GetMapping("/date-range")
    public ResponseEntity<?> getAppointmentsByDateRange(@RequestParam LocalDateTime startDate,
                                                        @RequestParam LocalDateTime endDate) {
        try {
            List<AppointmentModel> appointments = appointmentService.getAppointmentsByDateRange(startDate, endDate);
            List<AppointmentResponseDto> responseDtos = appointments.stream()
                    .map(this::convertToResponseDto)
                    .toList();
            return ResponseEntity.ok(responseDtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching appointments by date range: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAppointment(@PathVariable Long id, 
                                              @RequestBody UpdateAppointmentRequest request) {
        try {
            Optional<AppointmentModel> existingAppointment = appointmentService.getAppointmentById(id);
            if (existingAppointment.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            AppointmentModel appointment = existingAppointment.get();
            appointment.setDoctorName(request.getDoctorName());
            appointment.setReason(request.getReason());
            appointment.setDescription(request.getDescription());
            if (request.getAppointedDate() != null) {
                appointment.setAppointedDate(request.getAppointedDate());
            }

            AppointmentModel updatedAppointment = appointmentService.updateAppointment(appointment);
            return ResponseEntity.ok(convertToResponseDto(updatedAppointment));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating appointment: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable Long id, 
                                                   @RequestParam AppointmentStatus status) {
        try {

            AppointmentModel updatedAppointment = appointmentService.updateAppointmentStatus(id, status);
            return ResponseEntity.ok(convertToResponseDto(updatedAppointment));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating appointment status: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<?> acceptAppointment(@PathVariable Long id) {
        try {
            AppointmentModel appointment = appointmentService.acceptAppointment(id);
            return ResponseEntity.ok(convertToResponseDto(appointment));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error accepting appointment: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectAppointment(@PathVariable Long id) {
        try {
            AppointmentModel appointment = appointmentService.rejectAppointment(id);
            return ResponseEntity.ok(convertToResponseDto(appointment));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error rejecting appointment: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        try {
            appointmentService.deleteAppointment(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting appointment: " + e.getMessage());
        }
    }

    @GetMapping("/stats/status/{status}")
    public ResponseEntity<?> getAppointmentCountByStatus(@PathVariable AppointmentStatus status) {
        try {
            Long count = appointmentService.getAppointmentCountByStatus(status);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error getting appointment count: " + e.getMessage());
        }
    }

    @GetMapping("/stats/doctor/{doctorName}/status/{status}")
    public ResponseEntity<?> getAppointmentCountByDoctorNameAndStatus(@PathVariable String doctorName, 
                                                                    @PathVariable AppointmentStatus status) {
        try {
            Long count = appointmentService.getAppointmentCountByDoctorNameAndStatus(doctorName, status);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error getting appointment count for doctor: " + e.getMessage());
        }
    }

    @PostMapping("/process")
    public ResponseEntity<?> processAppointmentWithPattern(@RequestBody AppointmentModel appointment,
                                                          @RequestParam String processingType) {
        try {
            AppointmentModel processedAppointment = appointmentService.processAppointmentWithPattern(appointment, processingType);
            return ResponseEntity.ok(convertToResponseDto(processedAppointment));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing appointment with pattern: " + e.getMessage());
        }
    }

    private AppointmentResponseDto convertToResponseDto(AppointmentModel appointment) {
        User user = appointment.getUser();
        return new AppointmentResponseDto(
                appointment.getId(),
                appointment.getDoctorName(),
                appointment.getReason(),
                appointment.getDescription(),
                appointment.getAppointedDate(),
                appointment.getStatus(),
                appointment.getCreatedAt(),
                appointment.getUpdatedAt(),
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getContactNumber()
        );
    }
}
