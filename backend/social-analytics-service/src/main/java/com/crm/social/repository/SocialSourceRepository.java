package com.crm.social.repository;

import com.crm.social.model.SocialSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SocialSourceRepository extends JpaRepository<SocialSource, Long> {
    List<SocialSource> findByPlatform(String platform);
    @Query("SELECT s.platform, SUM(s.clicks), SUM(s.conversions), SUM(s.revenue) FROM SocialSource s GROUP BY s.platform ORDER BY SUM(s.revenue) DESC")
    List<Object[]> getPlatformSummary();
    @Query("SELECT s.campaignName, s.platform, SUM(s.clicks), SUM(s.conversions), SUM(s.revenue) FROM SocialSource s GROUP BY s.campaignName, s.platform ORDER BY SUM(s.revenue) DESC")
    List<Object[]> getCampaignSummary();
    void deleteByCampaignName(String campaignName);
}
