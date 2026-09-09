package com.example.secrud.claims.models;


import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Objects;

@Entity
@Table(name = "claims")
public class ClaimModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String claimId;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal claimAmount;

    @Column(nullable = false)
    private String userEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClaimStatus status;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateFilled;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClaimType type = ClaimType.CHILD;

    public enum ClaimStatus {
        PENDING,
        APPROVED,
        REJECTED
    }



    public enum ClaimType {
        CHILD,
        ADULT,
        SENIOR,
        CORPORATE
    }

    public ClaimModel() {}

    public ClaimModel(Long id, String claimId, BigDecimal claimAmount, String userEmail, ClaimStatus status,
                      LocalDate dateFilled,ClaimType type) {
        this.id = id;
        this.claimId = claimId;
        this.claimAmount = claimAmount;
        this.userEmail = userEmail;
        this.status = status;
        this.dateFilled = dateFilled;

        this.type = type;
    }

    // Constructor with default type value
    public ClaimModel(Long id, String claimId, BigDecimal claimAmount, String userEmail, ClaimStatus status,
                      LocalDate dateFilled) {
        this.id = id;
        this.claimId = claimId;
        this.claimAmount = claimAmount;
        this.userEmail = userEmail;
        this.status = status;
        this.dateFilled = dateFilled;


    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getClaimId() { return claimId; }
    public void setClaimId(String claimId) { this.claimId = claimId; }

    public BigDecimal getClaimAmount() { return claimAmount; }
    public void setClaimAmount(BigDecimal claimAmount) { this.claimAmount = claimAmount; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public ClaimStatus getStatus() { return status; }
    public void setStatus(ClaimStatus status) { this.status = status; }

    public LocalDate getDateFilled() { return dateFilled; }
    public void setDateFilled(LocalDate dateFilled) { this.dateFilled = dateFilled; }



    public ClaimType getType() { return type; }
    public void setType(ClaimType type) { this.type = type; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ClaimModel that = (ClaimModel) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "ClaimModel{" +
                "id=" + id +
                ", claimId='" + claimId + '\'' +
                ", claimAmount=" + claimAmount +
                ", userEmail='" + userEmail + '\'' +
                ", status=" + status +
                ", dateFilled=" + dateFilled +

                ", type=" + type +
                '}';
    }
}

