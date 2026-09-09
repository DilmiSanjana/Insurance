package com.example.secrud.support_ticket.services;


import com.example.secrud.support_ticket.models.CustomerSupportTicket;

import java.util.List;
import java.util.Optional;

public interface CustomerSupportTicketService {
    CustomerSupportTicket create(CustomerSupportTicket ticket);
    Optional<CustomerSupportTicket> getById(Long id);
    List<CustomerSupportTicket> getAll();
    Optional<CustomerSupportTicket> update(Long id, CustomerSupportTicket updated);
    boolean delete(Long id);
}