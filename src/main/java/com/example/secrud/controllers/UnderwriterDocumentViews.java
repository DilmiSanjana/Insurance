package com.example.secrud.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UnderwriterDocumentViews {

    @GetMapping("/underwriter-documents")
    public String customerDocuments() {
        return "customer-underwriter-documents";
    }

    @GetMapping("/admin-underwriter-documents")
    public String adminDocuments() {
        return "admin-underwriter-documents";
    }
}