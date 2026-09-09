package com.example.secrud.support_ticket.repositories;


import com.example.secrud.support_ticket.models.CustomerSupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerSupportTicketRepository extends JpaRepository<CustomerSupportTicket, Long> {
}
