package com.example.secrud.views;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {
    @GetMapping("/register")
    public String register() {
        return "register";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/profile")
    public String profile() {
        return "profile";
    }

    @GetMapping("/")
    public String dashboard() {
        return "index";
    }

    @GetMapping("/dashboard")
    public String index() {
        return "index";
    }

    @GetMapping("/admin-login")
    public String adminLogin() {
        return "admin-login";
    }

    @GetMapping("/admin-dashboard")
    public String adminDashboard() {
        return "admin-dashboard";
    }

    @GetMapping("/my-payments")
    public String myPayments() {
        return "my-payments";
    }

    @GetMapping("/admin-payments")
    public String adminPayments() {
        return "admin-payments";
    }

    @GetMapping("/doctor-dashboard")
    public String doctorDashboard() {
        return "appointments/doctor-dashboard";
    }

    @GetMapping("/doctor-login")
    public String createAppointment() {
        return "appointments/doctor-login";
    }
    @GetMapping("/my-appointments")
    public String myAppointments() {
        return "appointments/my-appointments";
    }
    
}
