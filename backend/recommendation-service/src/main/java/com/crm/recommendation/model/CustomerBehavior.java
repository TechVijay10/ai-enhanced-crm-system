package com.crm.recommendation.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "customer_behavior")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CustomerBehavior {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "customer_id") private Long customerId;
    @Column(name = "response_rate") private Double responseRate;
    @Column(name = "purchase_frequency") private Integer purchaseFrequency;
    @Column(name = "interaction_gap_days") private Integer interactionGapDays;
    @Column(name = "total_purchases") private Integer totalPurchases;
    @Column(name = "last_contact_date") private LocalDateTime lastContactDate;
    @Column(name = "updated_at") private LocalDateTime updatedAt;
    @PrePersist @PreUpdate public void preUpdate() { updatedAt = LocalDateTime.now(); }
}
