package com.example.secrud.support_ticket.views;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
class CustomerSupportViews {
    @GetMapping("/my-tickets")
    public String customerTickets() {
        return "customer-tickets";
    }

}