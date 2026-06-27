package com.crm.customer.controller;

import com.crm.customer.model.*;
import com.crm.customer.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    public ResponseEntity<Customer> create(@RequestBody Customer customer) {
        return ResponseEntity.ok(customerService.createCustomer(customer));
    }

    @GetMapping
    public ResponseEntity<List<Customer>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        if (search != null && !search.isEmpty())
            return ResponseEntity.ok(customerService.searchCustomers(search));
        if (status != null && !status.isEmpty())
            return ResponseEntity.ok(customerService.getCustomersByStatus(status));
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getById(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> update(@PathVariable Long id, @RequestBody Customer customer) {
        return ResponseEntity.ok(customerService.updateCustomer(id, customer));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok("Customer deleted successfully");
    }

    @PostMapping("/{id}/interactions")
    public ResponseEntity<CustomerInteraction> addInteraction(
            @PathVariable Long id, @RequestBody CustomerInteraction interaction) {
        return ResponseEntity.ok(customerService.addInteraction(id, interaction));
    }

    @GetMapping("/{id}/interactions")
    public ResponseEntity<List<CustomerInteraction>> getInteractions(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getInteractions(id));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(customerService.getCustomerStats());
    }
}
