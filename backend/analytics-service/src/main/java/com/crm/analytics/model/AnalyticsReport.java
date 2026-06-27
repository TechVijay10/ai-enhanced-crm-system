package com.crm.analytics.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name = "analytics_reports")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AnalyticsReport {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "report_type") private String reportType;
    @Column(name = "report_month") private Integer reportMonth;
    @Column(name = "report_year") private Integer reportYear;
    @Column(name = "total_revenue") private BigDecimal totalRevenue;
    @Column(name = "total_leads") private Integer totalLeads;
    @Column(name = "converted_leads") private Integer convertedLeads;
    @Column(name = "new_customers") private Integer newCustomers;
    @Lob @Column(name = "report_data") private String reportData;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @PrePersist public void prePersist() { createdAt = LocalDateTime.now(); }
}
