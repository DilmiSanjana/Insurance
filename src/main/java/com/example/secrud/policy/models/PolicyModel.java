package com.example.secrud.policy.models;
import jakarta.persistence.*;

@Entity
@Table(name = "policies")
public class PolicyModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String policyTitle;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String additionalDetails;

    @Column(nullable = false, unique = true)
    private String policyIdentificationNumber;

    @Column(nullable = false)
    private Boolean deleteStatus = false;

    @Column(nullable = false)
    private Boolean activeStatus = true;

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPolicyTitle() {
        return policyTitle;
    }

    public void setPolicyTitle(String policyTitle) {
        this.policyTitle = policyTitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAdditionalDetails() {
        return additionalDetails;
    }

    public void setAdditionalDetails(String additionalDetails) {
        this.additionalDetails = additionalDetails;
    }

    public String getPolicyIdentificationNumber() {
        return policyIdentificationNumber;
    }

    public void setPolicyIdentificationNumber(String policyIdentificationNumber) {
        this.policyIdentificationNumber = policyIdentificationNumber;
    }

    public Boolean getDeleteStatus() {
        return deleteStatus;
    }

    public void setDeleteStatus(Boolean deleteStatus) {
        this.deleteStatus = deleteStatus;
    }

    public Boolean getActiveStatus() {
        return activeStatus;
    }

    public void setActiveStatus(Boolean activeStatus) {
        this.activeStatus = activeStatus;
    }
}