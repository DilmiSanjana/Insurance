package com.example.secrud.payment.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import com.example.secrud.payment.models.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UpdatePaymentRequest {

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    private PaymentStatus status;
    private LocalDateTime additionalDate1;
    private LocalDateTime additionalDate2;
    private LocalDateTime additionalDate3;

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public LocalDateTime getAdditionalDate1() { return additionalDate1; }
    public void setAdditionalDate1(LocalDateTime additionalDate1) { this.additionalDate1 = additionalDate1; }

    public LocalDateTime getAdditionalDate2() { return additionalDate2; }
    public void setAdditionalDate2(LocalDateTime additionalDate2) { this.additionalDate2 = additionalDate2; }

    public LocalDateTime getAdditionalDate3() { return additionalDate3; }
    public void setAdditionalDate3(LocalDateTime additionalDate3) { this.additionalDate3 = additionalDate3; }
}
