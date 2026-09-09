package com.example.secrud.appointment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UpdateAppointmentRequest {

    @NotBlank(message = "Doctor name is required")
    @Size(max = 100, message = "Doctor name must not exceed 100 characters")
    private String doctorName;

    @NotBlank(message = "Reason is required")
    @Size(max = 200, message = "Reason must not exceed 200 characters")
    private String reason;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    private LocalDateTime appointedDate;

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getAppointedDate() { return appointedDate; }
    public void setAppointedDate(LocalDateTime appointedDate) { this.appointedDate = appointedDate; }
}
