package com.crm.lead.controller;

import com.crm.lead.model.Lead;
import com.crm.lead.service.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/leads")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class LeadController {

    private final LeadService leadService;

    @PostMapping
    public ResponseEntity<Lead> create(@RequestBody Lead lead) {
        return ResponseEntity.ok(leadService.createLead(lead));
    }

    @GetMapping
    public ResponseEntity<List<Lead>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority) {
        if (search != null) return ResponseEntity.ok(leadService.searchLeads(search));
        if (status != null) return ResponseEntity.ok(leadService.getLeadsByStatus(status));
        if (priority != null) return ResponseEntity.ok(leadService.getLeadsByPriority(priority));
        return ResponseEntity.ok(leadService.getAllLeads());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lead> getById(@PathVariable Long id) {
        return ResponseEntity.ok(leadService.getLeadById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lead> update(@PathVariable Long id, @RequestBody Lead lead) {
        return ResponseEntity.ok(leadService.updateLead(id, lead));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        leadService.deleteLead(id);
        return ResponseEntity.ok("Lead deleted");
    }

    @GetMapping("/score/{id}")
    public ResponseEntity<Map<String, Object>> getScore(@PathVariable Long id) {
        return ResponseEntity.ok(leadService.getLeadScore(id));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(leadService.getLeadStats());
    }
}
