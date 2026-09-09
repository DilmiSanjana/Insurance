package com.example.secrud.support_ticket.models;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "customer_support_tickets")
public class CustomerSupportTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String customerEmail;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status = TicketStatus.PENDING;

    @Column(length = 2000)
    private String reply; // default null

    public enum TicketStatus {
        PENDING,
        IN_PROGRESS,
        RESOLVED
    }

    public CustomerSupportTicket() {}

    public CustomerSupportTicket(Long id, String customerEmail, String title, String description, TicketStatus status, String reply) {
        this.id = id;
        this.customerEmail = customerEmail;
        this.title = title;
        this.description = description;
        this.status = status;
        this.reply = reply;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CustomerSupportTicket that = (CustomerSupportTicket) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() { return Objects.hash(id); }

    @Override
    public String toString() {
        return "CustomerSupportTicket{" +
                "id=" + id +
                ", customerEmail='" + customerEmail + '\'' +
                ", title='" + title + '\'' +
                ", description='" + (description != null ? (description.length() > 50 ? description.substring(0, 50) + "…" : description) : null) + '\'' +
                ", status=" + status +
                ", reply='" + reply + '\'' +
                '}';
    }
}
