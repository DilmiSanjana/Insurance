package com.example.secrud.payment.services.impl;

import com.example.secrud.payment.models.PaymentModel;
import com.example.secrud.payment.models.PaymentStatus;
import com.example.secrud.payment.repositories.PaymentRepository;
import com.example.secrud.payment.services.PaymentService;
import com.example.secrud.user.model.User;
import com.example.secrud.designpatterns.factory.EntityProcessorFactory;
import com.example.secrud.designpatterns.factory.EntityProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private EntityProcessorFactory<PaymentModel> paymentProcessorFactory;

    @Override
    public PaymentModel createPayment(PaymentModel payment) {
        if (payment.getStatus() == null) {
            payment.setStatus(PaymentStatus.PENDING);
        }
        return paymentRepository.save(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PaymentModel> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentModel> getAllPayments() {
        return paymentRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentModel> getPaymentsByUser(User user) {
        return paymentRepository.findByUser(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentModel> getPaymentsByUserId(Long userId) {
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentModel> getPaymentsByStatus(PaymentStatus status) {
        return paymentRepository.findByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentModel> getPaymentsByUserAndStatus(User user, PaymentStatus status) {
        return paymentRepository.findByUserAndStatus(user, status);
    }

    @Override
    public PaymentModel updatePaymentStatus(Long paymentId, PaymentStatus status) {
        PaymentModel payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));
        
        payment.setStatus(status);
        
        if (status == PaymentStatus.COMPLETED && payment.getPaidDate() == null) {
            payment.setPaidDate(LocalDateTime.now());
        }
        
        return paymentRepository.save(payment);
    }

    @Override
    public PaymentModel updatePayment(PaymentModel payment) {
        return paymentRepository.save(payment);
    }

    @Override
    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getTotalPaidAmountByUser(User user) {
        return paymentRepository.getTotalPaidAmountByUserId(user.getId()).orElse(BigDecimal.ZERO);
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getTotalPaidAmountByUserId(Long userId) {
        return paymentRepository.getTotalPaidAmountByUserId(userId).orElse(BigDecimal.ZERO);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getCompletedPaymentCountByUser(User user) {
        return paymentRepository.getCompletedPaymentCountByUserId(user.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public Long getCompletedPaymentCountByUserId(Long userId) {
        return paymentRepository.getCompletedPaymentCountByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentModel> getPaymentsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return paymentRepository.findByPaidDateBetween(startDate, endDate);
    }

    @Override
    public PaymentModel markPaymentAsCompleted(Long paymentId) {
        return updatePaymentStatus(paymentId, PaymentStatus.COMPLETED);
    }

    @Override
    public PaymentModel markPaymentAsFailed(Long paymentId) {
        return updatePaymentStatus(paymentId, PaymentStatus.FAILED);
    }

    @Override
    public PaymentModel cancelPayment(Long paymentId) {
        return updatePaymentStatus(paymentId, PaymentStatus.CANCELLED);
    }

    @Override
    public PaymentModel refundPayment(Long paymentId) {
        return updatePaymentStatus(paymentId, PaymentStatus.REFUNDED);
    }

    @Override
    public PaymentModel processPaymentWithPattern(PaymentModel payment, String processingType) {
        try {
            EntityProcessor<PaymentModel> processor = paymentProcessorFactory.createProcessor(processingType);
            return processor.processEntity(payment, processingType);
        } catch (Exception e) {
            throw new RuntimeException("Failed to process payment with pattern: " + e.getMessage(), e);
        }
    }
}
