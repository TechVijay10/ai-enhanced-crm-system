package com.crm.analytics.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name = "revenue_reports")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class RevenueReport {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private Integer month;
    private Integer year;
    private BigDecimal revenue;
    private BigDecimal expenses;
    private BigDecimal profit;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @PrePersist public void prePersist() { createdAt = LocalDateTime.now(); }
}
