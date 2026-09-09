package com.example.secrud.support_ticket.services.impl;


import com.example.secrud.support_ticket.models.CustomerSupportTicket;
import com.example.secrud.support_ticket.repositories.CustomerSupportTicketRepository;
import com.example.secrud.support_ticket.services.CustomerSupportTicketService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerSupportTicketServiceImpl implements CustomerSupportTicketService {

    private final CustomerSupportTicketRepository repository;

    public CustomerSupportTicketServiceImpl(CustomerSupportTicketRepository repository) {
        this.repository = repository;
    }

    @Override
    public CustomerSupportTicket create(CustomerSupportTicket ticket) {
        try {
            return repository.save(ticket);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create ticket: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<CustomerSupportTicket> getById(Long id) {
        try {
            return repository.findById(id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch ticket: " + e.getMessage(), e);
        }
    }

    @Override
    public List<CustomerSupportTicket> getAll() {
        try {
            return repository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch tickets: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<CustomerSupportTicket> update(Long id, CustomerSupportTicket updated) {
        try {
            return repository.findById(id).map(existing -> {
                existing.setCustomerEmail(updated.getCustomerEmail());
                existing.setTitle(updated.getTitle());
                existing.setDescription(updated.getDescription());
                existing.setStatus(updated.getStatus());
                existing.setReply(updated.getReply());
                return repository.save(existing);
            });
        } catch (Exception e) {
            throw new RuntimeException("Failed to update ticket: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean delete(Long id) {
        try {
            if (repository.existsById(id)) {
                repository.deleteById(id);
                return true;
            }
            return false;
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete ticket: " + e.getMessage(), e);
        }
    }
}
