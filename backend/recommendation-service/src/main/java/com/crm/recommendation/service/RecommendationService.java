package com.crm.recommendation.service;

import com.crm.recommendation.model.CustomerBehavior;
import com.crm.recommendation.repository.CustomerBehaviorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final CustomerBehaviorRepository behaviorRepository;

    // AI Recommendation Logic from scope document:
    // HIGH VALUE: responseRate > 80% AND purchaseFrequency > 5
    // RISK CUSTOMER: interactionGapDays > 60
    public Map<String, Object> getRecommendation(Long customerId) {
        CustomerBehavior behavior = behaviorRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Behavior data not found for customer: " + customerId));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("customerId", customerId);
        result.put("responseRate", behavior.getResponseRate());
        result.put("purchaseFrequency", behavior.getPurchaseFrequency());
        result.put("interactionGapDays", behavior.getInteractionGapDays());
        result.put("totalPurchases", behavior.getTotalPurchases());

        String category;
        String recommendation;
        String priority;

        if (behavior.getResponseRate() != null && behavior.getResponseRate() > 80
                && behavior.getPurchaseFrequency() != null && behavior.getPurchaseFrequency() > 5) {
            category = "HIGH VALUE CUSTOMER";
            recommendation = "Offer premium loyalty program, schedule executive-level meetings, upsell enterprise packages.";
            priority = "HIGH";
        } else if (behavior.getInteractionGapDays() != null && behavior.getInteractionGapDays() > 60) {
            category = "RISK CUSTOMER";
            recommendation = "Immediate re-engagement campaign needed. Send personalized offer, escalate to manager.";
            priority = "URGENT";
        } else if (behavior.getResponseRate() != null && behavior.getResponseRate() > 50) {
            category = "MEDIUM VALUE CUSTOMER";
            recommendation = "Schedule regular follow-ups, send product updates, consider upgrade offers.";
            priority = "MEDIUM";
        } else {
            category = "LOW ENGAGEMENT CUSTOMER";
            recommendation = "Send re-engagement email series, offer introductory discount, track interaction.";
            priority = "LOW";
        }

        result.put("category", category);
        result.put("recommendation", recommendation);
        result.put("priority", priority);
        result.put("conversionProbability", calculateConversionProbability(behavior));
        return result;
    }

    private double calculateConversionProbability(CustomerBehavior b) {
        double score = 0;
        if (b.getResponseRate() != null) score += b.getResponseRate() * 0.4;
        if (b.getPurchaseFrequency() != null) score += Math.min(b.getPurchaseFrequency() * 5, 30);
        if (b.getInteractionGapDays() != null) score -= Math.min(b.getInteractionGapDays() * 0.5, 30);
        return Math.max(0, Math.min(100, Math.round(score * 10.0) / 10.0));
    }

    public List<CustomerBehavior> getAllBehavior() { return behaviorRepository.findAll(); }

    public CustomerBehavior saveBehavior(CustomerBehavior behavior) { return behaviorRepository.save(behavior); }

    public List<Map<String, Object>> getAllRecommendations() {
        List<Map<String, Object>> results = new ArrayList<>();
        behaviorRepository.findAll().forEach(b -> {
            try { results.add(getRecommendation(b.getCustomerId())); } catch (Exception ignored) {}
        });
        return results;
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteBehaviorByCustomerId(Long customerId) {
        behaviorRepository.deleteByCustomerId(customerId);
    }
}
