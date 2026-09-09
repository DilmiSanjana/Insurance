package com.example.secrud.payment.views;

import com.example.secrud.payment.models.PaymentModel;
import com.example.secrud.payment.models.PaymentStatus;
import com.example.secrud.payment.services.PaymentService;
import com.example.secrud.user.model.User;
import com.example.secrud.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/payments")
public class PaymentViews {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserService userService;

    @GetMapping
    public String getAllPayments(Model model) {
        List<PaymentModel> payments = paymentService.getAllPayments();
        model.addAttribute("payments", payments);
        return "payments/list";
    }

    @GetMapping("/user/{userId}")
    public String getPaymentsByUser(@PathVariable Long userId, Model model) {
        List<PaymentModel> payments = paymentService.getPaymentsByUserId(userId);
        Optional<User> user = userService.getById(userId);
        
        model.addAttribute("payments", payments);
        model.addAttribute("user", user.orElse(null));
        return "payments/user-payments";
    }

    @GetMapping("/create")
    public String createPaymentForm(Model model) {
        List<User> users = userService.getAll();
        model.addAttribute("payment", new PaymentModel());
        model.addAttribute("users", users);
        return "payments/create";
    }

    @PostMapping("/create")
    public String createPayment(@ModelAttribute PaymentModel payment, 
                               @RequestParam Long userId) {
        Optional<User> user = userService.getById(userId);
        if (user.isPresent()) {
            payment.setUser(user.get());
            paymentService.createPayment(payment);
        }
        return "redirect:/payments";
    }

    @GetMapping("/{id}")
    public String getPaymentById(@PathVariable Long id, Model model) {
        Optional<PaymentModel> payment = paymentService.getPaymentById(id);
        if (payment.isPresent()) {
            model.addAttribute("payment", payment.get());
            return "payments/detail";
        }
        return "redirect:/payments";
    }

    @GetMapping("/{id}/edit")
    public String editPaymentForm(@PathVariable Long id, Model model) {
        Optional<PaymentModel> payment = paymentService.getPaymentById(id);
        if (payment.isPresent()) {
            model.addAttribute("payment", payment.get());
            return "payments/edit";
        }
        return "redirect:/payments";
    }

    @PostMapping("/{id}/edit")
    public String updatePayment(@PathVariable Long id, @ModelAttribute PaymentModel payment) {
        payment.setId(id);
        paymentService.updatePayment(payment);
        return "redirect:/payments/" + id;
    }

    @PostMapping("/{id}/status")
    public String updatePaymentStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            PaymentStatus paymentStatus = PaymentStatus.valueOf(status.toUpperCase());
            paymentService.updatePaymentStatus(id, paymentStatus);
        } catch (IllegalArgumentException e) {
            // Handle invalid status
        }
        return "redirect:/payments/" + id;
    }

    @PostMapping("/{id}/delete")
    public String deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return "redirect:/payments";
    }

    @GetMapping("/user/{userId}/summary")
    public String getUserPaymentSummary(@PathVariable Long userId, Model model) {
        Optional<User> user = userService.getById(userId);
        if (user.isPresent()) {
            BigDecimal totalAmount = paymentService.getTotalPaidAmountByUserId(userId);
            Long completedCount = paymentService.getCompletedPaymentCountByUserId(userId);
            List<PaymentModel> recentPayments = paymentService.getPaymentsByUserId(userId);
            
            model.addAttribute("user", user.get());
            model.addAttribute("totalAmount", totalAmount);
            model.addAttribute("completedCount", completedCount);
            model.addAttribute("recentPayments", recentPayments);
            
            return "payments/user-summary";
        }
        return "redirect:/payments";
    }
}
