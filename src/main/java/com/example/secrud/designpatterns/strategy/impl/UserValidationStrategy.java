package com.example.secrud.designpatterns.strategy.impl;

import com.example.secrud.designpatterns.strategy.ProcessingStrategy;
import com.example.secrud.user.model.User;
import java.util.regex.Pattern;

public class UserValidationStrategy implements ProcessingStrategy<User> {
    
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\+?\\d{10,15}$");
    
    @Override
    public User process(User user) {
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("User email is required");
        }
        
        if (!EMAIL_PATTERN.matcher(user.getEmail()).matches()) {
            throw new IllegalArgumentException("Invalid email format");
        }
        
        if (user.getContactNumber() == null || user.getContactNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("User contact number is required");
        }
        
        if (!PHONE_PATTERN.matcher(user.getContactNumber()).matches()) {
            throw new IllegalArgumentException("Invalid contact number format");
        }
        
        if (user.getFirstName() == null || user.getFirstName().trim().isEmpty()) {
            throw new IllegalArgumentException("User first name is required");
        }
        
        if (user.getLastName() == null || user.getLastName().trim().isEmpty()) {
            throw new IllegalArgumentException("User last name is required");
        }
        
        return user;
    }
    
    @Override
    public String getStrategyType() {
        return "VALIDATION";
    }
}
