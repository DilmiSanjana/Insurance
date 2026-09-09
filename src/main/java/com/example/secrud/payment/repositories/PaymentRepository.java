package com.example.secrud.payment.repositories;

import com.example.secrud.payment.models.PaymentModel;
import com.example.secrud.payment.models.PaymentStatus;
import com.example.secrud.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentModel, Long> {

    List<PaymentModel> findByUser(User user);

    List<PaymentModel> findByUserAndStatus(User user, PaymentStatus status);

    List<PaymentModel> findByStatus(PaymentStatus status);

    @Query("SELECT p FROM PaymentModel p WHERE p.user.id = :userId ORDER BY p.createdAt DESC")
    List<PaymentModel> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    @Query("SELECT p FROM PaymentModel p WHERE p.paidDate BETWEEN :startDate AND :endDate")
    List<PaymentModel> findByPaidDateBetween(@Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(p.amount) FROM PaymentModel p WHERE p.user.id = :userId AND p.status = 'COMPLETED'")
    Optional<BigDecimal> getTotalPaidAmountByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(p) FROM PaymentModel p WHERE p.user.id = :userId AND p.status = 'COMPLETED'")
    Long getCompletedPaymentCountByUserId(@Param("userId") Long userId);
}
