package com.crm.social.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name = "social_sources")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SocialSource {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, length = 100) private String platform;
    @Column(name = "lead_id") private Long leadId;
    @Column(name = "campaign_name", length = 200) private String campaignName;
    private Integer clicks;
    private Integer conversions;
    private BigDecimal revenue;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @PrePersist public void prePersist() {
        createdAt = LocalDateTime.now();
        if (clicks == null) clicks = 0;
        if (conversions == null) conversions = 0;
    }
}
