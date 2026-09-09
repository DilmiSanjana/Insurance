package com.example.secrud.payment.controllers;

import com.example.secrud.payment.models.PaymentModel;
import com.example.secrud.payment.models.PaymentStatus;
import com.example.secrud.payment.services.PaymentService;
import com.example.secrud.payment.dto.CreatePaymentRequest;
import com.example.secrud.payment.dto.UpdatePaymentRequest;
import com.example.secrud.payment.dto.PaymentResponseDto;
import com.example.secrud.user.model.User;
import com.example.secrud.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<PaymentResponseDto> createPayment(@RequestBody CreatePaymentRequest request) {
        try {
            Optional<User> user = userService.getById(request.getUserId());
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            PaymentModel payment = new PaymentModel();
            payment.setAmount(request.getAmount());
            payment.setUser(user.get());
            payment.setStatus(request.getStatus() != null ? request.getStatus() : PaymentStatus.PENDING);
            payment.setAdditionalDate1(request.getAdditionalDate1());
            payment.setAdditionalDate2(request.getAdditionalDate2());
            payment.setAdditionalDate3(request.getAdditionalDate3());

            PaymentModel createdPayment = paymentService.createPayment(payment);
            PaymentResponseDto responseDto = convertToResponseDto(createdPayment);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponseDto> getPaymentById(@PathVariable Long id) {
        Optional<PaymentModel> payment = paymentService.getPaymentById(id);
        return payment.map(p -> ResponseEntity.ok(convertToResponseDto(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<PaymentResponseDto>> getAllPayments() {
        List<PaymentModel> payments = paymentService.getAllPayments();
        List<PaymentResponseDto> responseDtos = payments.stream()
                .map(this::convertToResponseDto)
                .toList();
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PaymentResponseDto>> getPaymentsByUserId(@PathVariable Long userId) {
        List<PaymentModel> payments = paymentService.getPaymentsByUserId(userId);
        List<PaymentResponseDto> responseDtos = payments.stream()
                .map(this::convertToResponseDto)
                .toList();
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PaymentResponseDto>> getPaymentsByStatus(@PathVariable PaymentStatus status) {
        List<PaymentModel> payments = paymentService.getPaymentsByStatus(status);
        List<PaymentResponseDto> responseDtos = payments.stream()
                .map(this::convertToResponseDto)
                .toList();
        return ResponseEntity.ok(responseDtos);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<PaymentResponseDto> updatePaymentStatus(@PathVariable Long id, 
                                                          @RequestParam PaymentStatus status) {
        try {
            PaymentModel updatedPayment = paymentService.updatePaymentStatus(id, status);
            return ResponseEntity.ok(convertToResponseDto(updatedPayment));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentResponseDto> updatePayment(@PathVariable Long id, 
                                                    @RequestBody UpdatePaymentRequest request) {
        try {
            Optional<PaymentModel> existingPayment = paymentService.getPaymentById(id);
            if (existingPayment.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            PaymentModel payment = existingPayment.get();
            payment.setAmount(request.getAmount());
            if (request.getStatus() != null) {
                payment.setStatus(request.getStatus());
            }
            payment.setAdditionalDate1(request.getAdditionalDate1());
            payment.setAdditionalDate2(request.getAdditionalDate2());
            payment.setAdditionalDate3(request.getAdditionalDate3());

            PaymentModel updatedPayment = paymentService.updatePayment(payment);
            return ResponseEntity.ok(convertToResponseDto(updatedPayment));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        try {
            paymentService.deletePayment(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}/total")
    public ResponseEntity<BigDecimal> getTotalPaidAmountByUserId(@PathVariable Long userId) {
        BigDecimal totalAmount = paymentService.getTotalPaidAmountByUserId(userId);
        return ResponseEntity.ok(totalAmount);
    }

    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> getCompletedPaymentCountByUserId(@PathVariable Long userId) {
        Long count = paymentService.getCompletedPaymentCountByUserId(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<PaymentResponseDto>> getPaymentsByDateRange(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<PaymentModel> payments = paymentService.getPaymentsByDateRange(startDate, endDate);
        List<PaymentResponseDto> responseDtos = payments.stream()
                .map(this::convertToResponseDto)
                .toList();
        return ResponseEntity.ok(responseDtos);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<PaymentResponseDto> markPaymentAsCompleted(@PathVariable Long id) {
        try {
            PaymentModel payment = paymentService.markPaymentAsCompleted(id);
            return ResponseEntity.ok(convertToResponseDto(payment));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/fail")
    public ResponseEntity<PaymentResponseDto> markPaymentAsFailed(@PathVariable Long id) {
        try {
            PaymentModel payment = paymentService.markPaymentAsFailed(id);
            return ResponseEntity.ok(convertToResponseDto(payment));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<PaymentResponseDto> cancelPayment(@PathVariable Long id) {
        try {
            PaymentModel payment = paymentService.cancelPayment(id);
            return ResponseEntity.ok(convertToResponseDto(payment));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/refund")
    public ResponseEntity<PaymentResponseDto> refundPayment(@PathVariable Long id) {
        try {
            PaymentModel payment = paymentService.refundPayment(id);
            return ResponseEntity.ok(convertToResponseDto(payment));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/process")
    public ResponseEntity<?> processPaymentWithPattern(@RequestBody PaymentModel payment,
                                                      @RequestParam String processingType) {
        try {
            PaymentModel processedPayment = paymentService.processPaymentWithPattern(payment, processingType);
            return ResponseEntity.ok(convertToResponseDto(processedPayment));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing payment with pattern: " + e.getMessage());
        }
    }

    private PaymentResponseDto convertToResponseDto(PaymentModel payment) {
        User user = payment.getUser();
        return new PaymentResponseDto(
                payment.getId(),
                payment.getAmount(),
                payment.getStatus(),
                payment.getPaidDate(),
                payment.getAdditionalDate1(),
                payment.getAdditionalDate2(),
                payment.getAdditionalDate3(),
                payment.getCreatedAt(),
                payment.getUpdatedAt(),
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getContactNumber()
        );
    }
}
