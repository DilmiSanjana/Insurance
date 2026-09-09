package com.example.secrud.policy.services;


import com.example.secrud.policy.models.PolicyModel;
import com.example.secrud.policy.repos.PolicyRepo;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PolicyService {

    private final PolicyRepo policyRepo;

    public PolicyService(PolicyRepo policyRepo) {
        this.policyRepo = policyRepo;
    }

    public List<PolicyModel> getAll() {
        return policyRepo.findAll();
    }

    public Optional<PolicyModel> getById(Long id) {
        return policyRepo.findById(id);
    }

    public PolicyModel create(PolicyModel policy) {
        return policyRepo.save(policy);
    }

    public Optional<PolicyModel> update(Long id, PolicyModel updated) {
        return policyRepo.findById(id).map(p -> {
            p.setPolicyTitle(updated.getPolicyTitle());
            p.setDescription(updated.getDescription());
            p.setAdditionalDetails(updated.getAdditionalDetails());
            p.setPolicyIdentificationNumber(updated.getPolicyIdentificationNumber());
            p.setDeleteStatus(updated.getDeleteStatus());
            p.setActiveStatus(updated.getActiveStatus());
            return policyRepo.save(p);
        });
    }

    public void delete(Long id) {
        policyRepo.deleteById(id);
    }
}