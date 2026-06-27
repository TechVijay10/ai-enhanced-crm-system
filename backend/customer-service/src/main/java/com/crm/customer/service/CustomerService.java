package com.crm.customer.service;

import com.crm.customer.model.*;
import com.crm.customer.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerInteractionRepository interactionRepository;

    public Customer createCustomer(Customer customer) {
        if (customerRepository.findByEmail(customer.getEmail()).isPresent())
            throw new RuntimeException("Email already exists: " + customer.getEmail());
        customer.setStatus(customer.getStatus() != null ? customer.getStatus() : "ACTIVE");
        customer.setCategory(customer.getCategory() != null ? customer.getCategory() : "STANDARD");
        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomers() { return customerRepository.findAll(); }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found: " + id));
    }

    public Customer updateCustomer(Long id, Customer updated) {
        Customer existing = getCustomerById(id);
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setPhone(updated.getPhone());
        existing.setCompany(updated.getCompany());
        existing.setIndustry(updated.getIndustry());
        existing.setStatus(updated.getStatus());
        existing.setCategory(updated.getCategory());
        existing.setAddress(updated.getAddress());
        existing.setCity(updated.getCity());
        existing.setCountry(updated.getCountry());
        existing.setAssignedTo(updated.getAssignedTo());
        return customerRepository.save(existing);
    }

    public void deleteCustomer(Long id) {
        if (customerRepository.findById(id).isEmpty())
            throw new RuntimeException("Customer not found: " + id);
        customerRepository.deleteById(id);
    }

    public List<Customer> searchCustomers(String keyword) {
        return customerRepository.searchCustomers(keyword);
    }

    public List<Customer> getCustomersByStatus(String status) {
        return customerRepository.findByStatus(status);
    }

    public CustomerInteraction addInteraction(Long customerId, CustomerInteraction interaction) {
        getCustomerById(customerId);
        interaction.setCustomerId(customerId);
        return interactionRepository.save(interaction);
    }

    public List<CustomerInteraction> getInteractions(Long customerId) {
        return interactionRepository.findByCustomerIdOrderByInteractionDateDesc(customerId);
    }

    public Map<String, Long> getCustomerStats() {
        return Map.of(
            "total", customerRepository.count(),
            "active", customerRepository.countByStatus("ACTIVE"),
            "inactive", customerRepository.countByStatus("INACTIVE")
        );
    }
}
