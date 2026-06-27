package com.crm.lead.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Lead {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_leads_gen")
    @SequenceGenerator(name = "seq_leads_gen", sequenceName = "seq_leads", allocationSize = 1)
    private Long id;

    @Column(name = "first_name", nullable = false, length = 100) private String firstName;
    @Column(name = "last_name", nullable = false, length = 100) private String lastName;
    @Column(length = 150) private String email;
    @Column(length = 20) private String phone;
    @Column(length = 200) private String company;
    @Column(length = 100) private String source;
    @Column(length = 50) private String status;
    @Column(length = 20) private String priority;
    @Column private Integer visits;
    @Column private Integer purchases;
    @Column private Integer responses;
    @Column(name = "social_engagement") private Integer socialEngagement;
    @Column private Integer score;
    @Column(name = "assigned_to") private Long assignedTo;
    @Column(name = "created_by") private Long createdBy;
    @Column(name = "converted_at") private LocalDateTime convertedAt;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @Column(name = "updated_at") private LocalDateTime updatedAt;

    @PrePersist public void prePersist() {
        createdAt = updatedAt = LocalDateTime.now();
        if (visits == null) visits = 0;
        if (purchases == null) purchases = 0;
        if (responses == null) responses = 0;
        if (socialEngagement == null) socialEngagement = 0;
        if (score == null) score = 0;
        if (status == null) status = "NEW";
        if (priority == null) priority = "MEDIUM";
    }
    @PreUpdate public void preUpdate() { updatedAt = LocalDateTime.now(); }
}
