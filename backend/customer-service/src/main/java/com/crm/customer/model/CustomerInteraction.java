package com.crm.customer.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_interactions")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CustomerInteraction {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_interactions_gen")
    @SequenceGenerator(name = "seq_interactions_gen", sequenceName = "seq_interactions", allocationSize = 1)
    private Long id;

    @Column(name = "customer_id") private Long customerId;
    @Column(name = "interaction_type", length = 50) private String interactionType;
    @Lob @Column private String notes;
    @Column(name = "interaction_date") private LocalDateTime interactionDate;
    @Column(name = "created_by") private Long createdBy;

    @PrePersist public void prePersist() { interactionDate = LocalDateTime.now(); }
}
