package com.example.secrud.payment.dto;

import com.example.secrud.payment.models.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentResponseDto {

    private Long id;
    private BigDecimal amount;
    private PaymentStatus status;
    private LocalDateTime paidDate;
    private LocalDateTime additionalDate1;
    private LocalDateTime additionalDate2;
    private LocalDateTime additionalDate3;
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

    public PaymentResponseDto() {}

    public PaymentResponseDto(Long id, BigDecimal amount, PaymentStatus status, 
                           LocalDateTime paidDate, LocalDateTime additionalDate1, 
                           LocalDateTime additionalDate2, LocalDateTime additionalDate3,
                           LocalDateTime createdAt, LocalDateTime updatedAt,
                           Long userId, String userFirstName, String userLastName, 
                           String userEmail, String userContactNumber) {
        this.id = id;
        this.amount = amount;
        this.status = status;
        this.paidDate = paidDate;
        this.additionalDate1 = additionalDate1;
        this.additionalDate2 = additionalDate2;
        this.additionalDate3 = additionalDate3;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.user = new UserDto(userId, userFirstName, userLastName, userEmail, userContactNumber);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public LocalDateTime getPaidDate() { return paidDate; }
    public void setPaidDate(LocalDateTime paidDate) { this.paidDate = paidDate; }

    public LocalDateTime getAdditionalDate1() { return additionalDate1; }
    public void setAdditionalDate1(LocalDateTime additionalDate1) { this.additionalDate1 = additionalDate1; }

    public LocalDateTime getAdditionalDate2() { return additionalDate2; }
    public void setAdditionalDate2(LocalDateTime additionalDate2) { this.additionalDate2 = additionalDate2; }

    public LocalDateTime getAdditionalDate3() { return additionalDate3; }
    public void setAdditionalDate3(LocalDateTime additionalDate3) { this.additionalDate3 = additionalDate3; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }
}
