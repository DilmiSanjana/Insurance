package com.example.secrud.user.controller;

import com.example.secrud.user.dto.LoginRequest;
import com.example.secrud.user.model.User;
import com.example.secrud.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll() {
        Map<String, Object> body = new HashMap<>();
        try {
            List<User> users = userService.getAll();
            body.put("success", true);
            body.put("data", users);
            body.put("message", "Users fetched successfully");
            return ResponseEntity.ok(body);
        } catch (Exception e) {
            body.put("success", false);
            body.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        Map<String, Object> body = new HashMap<>();
        try {
            User user = userService.getById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
            body.put("success", true);
            body.put("data", user);
            body.put("message", "User fetched successfully");
            return ResponseEntity.ok(body);
        } catch (IllegalArgumentException e) {
            body.put("success", false);
            body.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
        } catch (Exception e) {
            body.put("success", false);
            body.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody User user) {
        Map<String, Object> body = new HashMap<>();
        try {
            User created = userService.create(user);
            body.put("success", true);
            body.put("data", created);
            body.put("message", "User created successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(body);
        } catch (IllegalArgumentException e) {
            body.put("success", false);
            body.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
        } catch (Exception e) {
            body.put("success", false);
            body.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @Valid @RequestBody User user) {
        Map<String, Object> body = new HashMap<>();
        try {
            User updated = userService.update(id, user);
            body.put("success", true);
            body.put("data", updated);
            body.put("message", "User updated successfully");
            return ResponseEntity.ok(body);
        } catch (IllegalArgumentException e) {
            body.put("success", false);
            body.put("message", e.getMessage());
            HttpStatus status = e.getMessage().equals("User not found") ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
            return ResponseEntity.status(status).body(body);
        } catch (Exception e) {
            body.put("success", false);
            body.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        Map<String, Object> body = new HashMap<>();
        try {
            User user = userService.authenticate(request.getEmail(), request.getPassword());
            body.put("success", true);
            body.put("data", user);
            body.put("message", "Login successful");
            return ResponseEntity.ok(body);
        } catch (IllegalArgumentException e) {
            body.put("success", false);
            body.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
        } catch (Exception e) {
            body.put("success", false);
            body.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        Map<String, Object> body = new HashMap<>();
        try {
            userService.delete(id);
            body.put("success", true);
            body.put("message", "User deleted successfully");
            return ResponseEntity.ok(body);
        } catch (IllegalArgumentException e) {
            body.put("success", false);
            body.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
        } catch (Exception e) {
            body.put("success", false);
            body.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
        }
    }
}