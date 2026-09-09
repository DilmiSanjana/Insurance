package com.example.secrud.policy.repos;

import com.example.secrud.policy.models.PolicyModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PolicyRepo extends JpaRepository<PolicyModel, Long> {
    Optional<PolicyModel> findByPolicyIdentificationNumber(String policyIdentificationNumber);
}