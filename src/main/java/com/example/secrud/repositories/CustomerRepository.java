package com.example.secrud.repositories;

import com.example.secrud.models.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    List<Customer> findAllByOrderByFullNameAsc();
    Optional<Customer> findByEmailAddressIgnoreCase(String emailAddress);
    boolean existsByEmailAddressIgnoreCase(String emailAddress);
    Optional<Customer> findByPhoneNumber(String phoneNumber);
}