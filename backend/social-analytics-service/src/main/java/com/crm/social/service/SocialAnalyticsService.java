package com.crm.social.service;

import com.crm.social.model.SocialSource;
import com.crm.social.repository.SocialSourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SocialAnalyticsService {

    private final SocialSourceRepository socialSourceRepository;

    public SocialSource save(SocialSource source) { return socialSourceRepository.save(source); }

    public List<SocialSource> getAll() { return socialSourceRepository.findAll(); }

    public List<Map<String, Object>> getPlatformSummary() {
        List<Object[]> rows = socialSourceRepository.getPlatformSummary();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("platform", row[0]);
            m.put("totalClicks", row[1]);
            m.put("totalConversions", row[2]);
            m.put("totalRevenue", row[3]);
            double convRate = row[1] != null && ((Number) row[1]).doubleValue() > 0
                ? ((Number) row[2]).doubleValue() / ((Number) row[1]).doubleValue() * 100 : 0;
            m.put("conversionRate", Math.round(convRate * 100.0) / 100.0);
            result.add(m);
        }
        return result;
    }

    public List<Map<String, Object>> getCampaignSummary() {
        List<Object[]> rows = socialSourceRepository.getCampaignSummary();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("campaignName", row[0]);
            m.put("platform", row[1]);
            m.put("totalClicks", row[2]);
            m.put("totalConversions", row[3]);
            m.put("totalRevenue", row[4]);
            result.add(m);
        }
        return result;
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteByCampaignName(String campaignName) {
        socialSourceRepository.deleteByCampaignName(campaignName);
    }
}
