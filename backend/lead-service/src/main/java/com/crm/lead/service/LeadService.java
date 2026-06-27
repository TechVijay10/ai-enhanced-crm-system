package com.crm.lead.service;

import com.crm.lead.model.Lead;
import com.crm.lead.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;

    // AI Lead Scoring Formula:
    // Score = (Visits × 10) + (Purchases × 20) + (Responses × 15) + (SocialEngagement × 10)
    public int calculateScore(Lead lead) {
        int score = 0;
        score += (lead.getVisits() != null ? lead.getVisits() : 0) * 10;
        score += (lead.getPurchases() != null ? lead.getPurchases() : 0) * 20;
        score += (lead.getResponses() != null ? lead.getResponses() : 0) * 15;
        score += (lead.getSocialEngagement() != null ? lead.getSocialEngagement() : 0) * 10;
        return Math.min(score, 100);
    }

    public String getPriority(int score) {
        if (score >= 61) return "HIGH";
        if (score >= 31) return "MEDIUM";
        return "LOW";
    }

    public Lead createLead(Lead lead) {
        int score = calculateScore(lead);
        lead.setScore(score);
        lead.setPriority(getPriority(score));
        return leadRepository.save(lead);
    }

    public List<Lead> getAllLeads() { return leadRepository.findAll(); }

    public Lead getLeadById(Long id) {
        return leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found: " + id));
    }

    public Lead updateLead(Long id, Lead updated) {
        Lead existing = getLeadById(id);
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setCompany(updated.getCompany());
        existing.setSource(updated.getSource());
        existing.setStatus(updated.getStatus());
        existing.setVisits(updated.getVisits());
        existing.setPurchases(updated.getPurchases());
        existing.setResponses(updated.getResponses());
        existing.setSocialEngagement(updated.getSocialEngagement());
        existing.setAssignedTo(updated.getAssignedTo());
        if ("CONVERTED".equals(updated.getStatus())) {
            existing.setConvertedAt(LocalDateTime.now());
        }
        int score = calculateScore(existing);
        existing.setScore(score);
        existing.setPriority(getPriority(score));
        return leadRepository.save(existing);
    }

    public void deleteLead(Long id) { leadRepository.deleteById(id); }

    public Map<String, Object> getLeadScore(Long id) {
        Lead lead = getLeadById(id);
        int score = lead.getScore();
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("leadId", id);
        result.put("name", lead.getFirstName() + " " + lead.getLastName());
        result.put("score", score);
        result.put("priority", lead.getPriority());
        result.put("breakdown", Map.of(
            "visitScore", (lead.getVisits() != null ? lead.getVisits() : 0) * 10,
            "purchaseScore", (lead.getPurchases() != null ? lead.getPurchases() : 0) * 20,
            "responseScore", (lead.getResponses() != null ? lead.getResponses() : 0) * 15,
            "socialScore", (lead.getSocialEngagement() != null ? lead.getSocialEngagement() : 0) * 10
        ));
        result.put("category", score >= 61 ? "HIGH PRIORITY" : score >= 31 ? "MEDIUM PRIORITY" : "LOW PRIORITY");
        return result;
    }

    public Map<String, Object> getLeadStats() {
        List<Object[]> byStatus = leadRepository.countByStatus();
        List<Object[]> bySource = leadRepository.countBySource();
        Map<String, Long> statusMap = new LinkedHashMap<>();
        byStatus.forEach(r -> statusMap.put((String) r[0], (Long) r[1]));
        Map<String, Long> sourceMap = new LinkedHashMap<>();
        bySource.forEach(r -> sourceMap.put((String) r[0], (Long) r[1]));
        return Map.of("total", leadRepository.count(),
                      "converted", leadRepository.countConverted(),
                      "byStatus", statusMap, "bySource", sourceMap);
    }

    public List<Lead> searchLeads(String keyword) { return leadRepository.searchLeads(keyword); }
    public List<Lead> getLeadsByStatus(String status) { return leadRepository.findByStatus(status); }
    public List<Lead> getLeadsByPriority(String priority) { return leadRepository.findByPriority(priority); }
}
