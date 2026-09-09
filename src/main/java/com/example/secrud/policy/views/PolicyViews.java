package com.example.secrud.policy.views;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PolicyViews {
    @GetMapping("/policy-management")
    public  String adminList(){
        return "/policy_management/adminList";
    }

    @GetMapping("/admin/policies/create")
    public  String createPolicy(){
        return "/policy_management/create";
    }

    @GetMapping("/admin/policies/edit")
    public  String editPolicy(){
        return "/policy_management/edit";
    }

    @GetMapping("/policies")
    public  String customerView(){
        return "/policy_management/customerView";
    }
}

