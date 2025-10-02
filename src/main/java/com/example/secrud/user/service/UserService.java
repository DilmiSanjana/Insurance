package com.example.secrud.user.service;

import com.example.secrud.user.model.User;
import com.example.secrud.user.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.mindrot.jbcrypt.BCrypt;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAll() {
        try {
            return userRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch users", e);
        }
    }

    public Optional<User> getById(Long id) {
        try {
            return userRepository.findById(id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch user", e);
        }
    }

    public User create(User user) {
        try {
            if (userRepository.existsByEmail(user.getEmail())) {
                throw new IllegalArgumentException("Email already in use");
            }
            // Hash password before saving
            user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));
            return userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Invalid data provided", e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create user", e);
        }
    }

    public User update(Long id, User user) {
        try {
            return userRepository.findById(id).map(existing -> {
                if (!existing.getEmail().equals(user.getEmail()) && userRepository.existsByEmail(user.getEmail())) {
                    throw new IllegalArgumentException("Email already in use");
                }
                existing.setFirstName(user.getFirstName());
                existing.setLastName(user.getLastName());
                existing.setEmail(user.getEmail());
                existing.setContactNumber(user.getContactNumber());
                existing.setGender(user.getGender());
                if (user.getPassword() != null && !user.getPassword().isBlank()) {
                    existing.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));
                }
                return userRepository.save(existing);
            }).orElseThrow(() -> new IllegalArgumentException("User not found"));
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Invalid data provided", e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update user", e);
        }
    }
    public User authenticate(String email, String password) {
        try {
            return userRepository.findByEmail(email)
                    .filter(u -> BCrypt.checkpw(password, u.getPassword()))
                    .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to authenticate", e);
        }
    }

    public void delete(Long id) {
        try {
            if (!userRepository.existsById(id)) {
                throw new IllegalArgumentException("User not found");
            }
            userRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete user", e);
        }
    }
}