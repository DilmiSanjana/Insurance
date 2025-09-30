package com.example.secrud.views;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UnderWriterViews {
    @GetMapping("/")
    public String adminDocuments() {
        return "admin-underwriter-documents";
    }

    @GetMapping("/customer")
    public String customerDocs() {
        return "customer-underwriter-documents";
    }
}
