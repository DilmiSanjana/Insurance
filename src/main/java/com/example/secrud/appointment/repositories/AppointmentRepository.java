package com.example.secrud.appointment.repositories;

import com.example.secrud.appointment.models.AppointmentModel;
import com.example.secrud.appointment.models.AppointmentStatus;
import com.example.secrud.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<AppointmentModel, Long> {

    List<AppointmentModel> findByStatus(AppointmentStatus status);

    List<AppointmentModel> findByUser(User user);

    List<AppointmentModel> findByUserAndStatus(User user, AppointmentStatus status);

    @Query("SELECT a FROM AppointmentModel a WHERE a.user.id = :userId ORDER BY a.createdAt DESC")
    List<AppointmentModel> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    List<AppointmentModel> findByDoctorName(String doctorName);

    List<AppointmentModel> findByDoctorNameAndStatus(String doctorName, AppointmentStatus status);

    @Query("SELECT a FROM AppointmentModel a WHERE a.appointedDate BETWEEN :startDate AND :endDate")
    List<AppointmentModel> findByAppointedDateBetween(@Param("startDate") LocalDateTime startDate, 
                                                    @Param("endDate") LocalDateTime endDate);

    @Query("SELECT a FROM AppointmentModel a WHERE a.appointedDate >= :date ORDER BY a.appointedDate ASC")
    List<AppointmentModel> findUpcomingAppointments(@Param("date") LocalDateTime date);

    @Query("SELECT a FROM AppointmentModel a WHERE a.appointedDate < :date ORDER BY a.appointedDate DESC")
    List<AppointmentModel> findPastAppointments(@Param("date") LocalDateTime date);

    @Query("SELECT COUNT(a) FROM AppointmentModel a WHERE a.status = :status")
    Long countByStatus(@Param("status") AppointmentStatus status);

    @Query("SELECT COUNT(a) FROM AppointmentModel a WHERE a.doctorName = :doctorName AND a.status = :status")
    Long countByDoctorNameAndStatus(@Param("doctorName") String doctorName, 
                                   @Param("status") AppointmentStatus status);

    @Query("SELECT a FROM AppointmentModel a ORDER BY a.createdAt DESC")
    List<AppointmentModel> findAllOrderByCreatedAtDesc();
}
