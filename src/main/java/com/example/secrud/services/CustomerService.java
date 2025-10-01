package com.example.secrud.services;

import com.example.secrud.models.Customer;
import com.example.secrud.repositories.CustomerRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CustomerService {

    private final CustomerRepository repository;

    public CustomerService(CustomerRepository repository) {
        this.repository = repository;
    }

    public Customer create(Customer customer) {
        validate(customer);
        if (customer.getPassword() == null || customer.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (customer.getPassword().trim().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters");
        }
        if (repository.existsByEmailAddressIgnoreCase(customer.getEmailAddress().trim().toLowerCase())) {
            throw new IllegalArgumentException("Email address already exists");
        }
        normalize(customer);
        customer.setPassword(BCrypt.hashpw(customer.getPassword().trim(), BCrypt.gensalt()));
        return repository.save(customer);
    }

    @Transactional(readOnly = true)
    public List<Customer> getAll() {
        return repository.findAllByOrderByFullNameAsc();
    }

    @Transactional(readOnly = true)
    public Customer getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));
    }

    public Customer update(Long id, Customer updated) {
        Customer existing = getById(id);
        validate(updated);
        normalize(updated);
        existing.setFullName(updated.getFullName());
        existing.setDateOfBirth(updated.getDateOfBirth());
        existing.setGender(updated.getGender());
        existing.setPhoneNumber(updated.getPhoneNumber());
        existing.setEmailAddress(updated.getEmailAddress());
        existing.setHomeAddress(updated.getHomeAddress());
        existing.setDrivingLicenseNumber(updated.getDrivingLicenseNumber());
        if (updated.getPassword() != null && !updated.getPassword().trim().isEmpty()) {
            if (updated.getPassword().trim().length() < 8) {
                throw new IllegalArgumentException("Password must be at least 8 characters");
            }
            existing.setPassword(BCrypt.hashpw(updated.getPassword().trim(), BCrypt.gensalt()));
        }
        return repository.save(existing);
    }

    public void delete(Long id) {
        Customer existing = getById(id);
        repository.delete(existing);
    }

    public Customer authenticate(String emailAddress, String password) {
        if (emailAddress == null || emailAddress.trim().isEmpty()) {
            throw new IllegalArgumentException("Email address is required");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        Optional<Customer> opt = repository.findByEmailAddressIgnoreCase(emailAddress.trim());
        if (opt.isEmpty()) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        Customer found = opt.get();
        if (!BCrypt.checkpw(password.trim(), found.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        return found;
    }

    private void validate(Customer c) {
        if (c == null) throw new IllegalArgumentException("Customer cannot be null");
        if (c.getFullName() == null || c.getFullName().trim().isEmpty())
            throw new IllegalArgumentException("Full Name is required");
        if (c.getDateOfBirth() == null)
            throw new IllegalArgumentException("Date of Birth is required");
        if (c.getDateOfBirth().isAfter(LocalDate.now()))
            throw new IllegalArgumentException("Date of Birth cannot be in the future");
        if (c.getGender() == null || c.getGender().trim().isEmpty())
            throw new IllegalArgumentException("Gender is required");
        String gender = c.getGender().trim().toUpperCase();
        if (!(gender.equals("MALE") || gender.equals("FEMALE") || gender.equals("OTHER")))
            throw new IllegalArgumentException("Gender must be Male, Female, or Other");
        if (c.getPhoneNumber() == null || c.getPhoneNumber().trim().isEmpty())
            throw new IllegalArgumentException("Phone Number is required");
        String phone = c.getPhoneNumber().trim();
        if (!phone.matches("^[+]?[0-9\\s\\-()]{7,20}$"))
            throw new IllegalArgumentException("Invalid phone number format");
        if (c.getEmailAddress() == null || c.getEmailAddress().trim().isEmpty())
            throw new IllegalArgumentException("Email Address is required");
        String email = c.getEmailAddress().trim();
        if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"))
            throw new IllegalArgumentException("Invalid email format");
        if (c.getHomeAddress() != null && c.getHomeAddress().length() > 500)
            throw new IllegalArgumentException("Home Address must be <= 500 characters");
        if (c.getDrivingLicenseNumber() != null && c.getDrivingLicenseNumber().length() > 50)
            throw new IllegalArgumentException("Driving License Number must be <= 50 characters");
    }

    private void normalize(Customer c) {
        c.setFullName(c.getFullName().trim());
        c.setGender(c.getGender().trim().toUpperCase());
        c.setPhoneNumber(c.getPhoneNumber().trim());
        c.setEmailAddress(c.getEmailAddress().trim().toLowerCase());
        if (c.getHomeAddress() != null) c.setHomeAddress(c.getHomeAddress().trim());
        if (c.getDrivingLicenseNumber() != null) c.setDrivingLicenseNumber(c.getDrivingLicenseNumber().trim());
    }
}