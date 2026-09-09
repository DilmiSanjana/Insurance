package com.example.secrud.payment.services;

import com.example.secrud.payment.models.PaymentModel;
import com.example.secrud.payment.models.PaymentStatus;
import com.example.secrud.user.model.User;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PaymentService {

    PaymentModel createPayment(PaymentModel payment);

    Optional<PaymentModel> getPaymentById(Long id);

    List<PaymentModel> getAllPayments();

    List<PaymentModel> getPaymentsByUser(User user);

    List<PaymentModel> getPaymentsByUserId(Long userId);

    List<PaymentModel> getPaymentsByStatus(PaymentStatus status);

    List<PaymentModel> getPaymentsByUserAndStatus(User user, PaymentStatus status);

    PaymentModel updatePaymentStatus(Long paymentId, PaymentStatus status);

    PaymentModel updatePayment(PaymentModel payment);

    void deletePayment(Long id);

    BigDecimal getTotalPaidAmountByUser(User user);

    BigDecimal getTotalPaidAmountByUserId(Long userId);

    Long getCompletedPaymentCountByUser(User user);

    Long getCompletedPaymentCountByUserId(Long userId);

    List<PaymentModel> getPaymentsByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    PaymentModel markPaymentAsCompleted(Long paymentId);

    PaymentModel markPaymentAsFailed(Long paymentId);

    PaymentModel cancelPayment(Long paymentId);

    PaymentModel refundPayment(Long paymentId);

    PaymentModel processPaymentWithPattern(PaymentModel payment, String processingType);
}
