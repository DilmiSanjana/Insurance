package com.example.secrud.support_ticket.views;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SupportTicketViews {
    @GetMapping("/admin-tickets")
    public String adminTickets() {
        return "admin-tickets";
    }


}