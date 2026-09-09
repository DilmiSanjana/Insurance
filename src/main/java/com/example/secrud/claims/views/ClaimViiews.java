package com.example.secrud.claims.views;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
class ClaimViiews{
    @GetMapping("/my-claims")
    public String getMyClaims(){
        return "my-claims";
    }

    @GetMapping("/claims-management")
    public String adminClaims(){
        return "claims";
    }

}