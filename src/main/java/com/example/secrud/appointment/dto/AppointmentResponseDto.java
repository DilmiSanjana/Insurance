package com.example.secrud.appointment.dto;

import com.example.secrud.appointment.models.AppointmentStatus;
import java.time.LocalDateTime;

public class AppointmentResponseDto {

    private Long id;
    private String doctorName;
    private String reason;
    private String description;
    private LocalDateTime appointedDate;
    private AppointmentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserDto user;

    public static class UserDto {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String contactNumber;

        public UserDto(Long id, String firstName, String lastName, String email, String contactNumber) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.contactNumber = contactNumber;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }

        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getContactNumber() { return contactNumber; }
        public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    }

    public AppointmentResponseDto() {}

    public AppointmentResponseDto(Long id, String doctorName, String reason, String description,
                                 LocalDateTime appointedDate, AppointmentStatus status,
                                 LocalDateTime createdAt, LocalDateTime updatedAt,
                                 Long userId, String userFirstName, String userLastName, 
                                 String userEmail, String userContactNumber) {
        this.id = id;
        this.doctorName = doctorName;
        this.reason = reason;
        this.description = description;
        this.appointedDate = appointedDate;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.user = new UserDto(userId, userFirstName, userLastName, userEmail, userContactNumber);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getAppointedDate() { return appointedDate; }
    public void setAppointedDate(LocalDateTime appointedDate) { this.appointedDate = appointedDate; }

    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }
}
