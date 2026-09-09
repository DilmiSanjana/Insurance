package com.example.secrud.claims.repositories;

import com.example.secrud.claims.models.ClaimModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClaimRepository extends JpaRepository<ClaimModel, Long> {
    Optional<ClaimModel> findByClaimId(String claimId);
    List<ClaimModel> findByType(ClaimModel.ClaimType type);
    boolean existsByClaimId(String claimId);
}
