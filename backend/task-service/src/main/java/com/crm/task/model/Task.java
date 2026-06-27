package com.crm.task.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "tasks")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_tasks_gen")
    @SequenceGenerator(name = "seq_tasks_gen", sequenceName = "seq_tasks", allocationSize = 1)
    private Long id;
    @Column(nullable = false, length = 200) private String title;
    @Lob private String description;
    @Column(length = 50) private String status;
    @Column(length = 20) private String priority;
    @Column(name = "due_date") private LocalDateTime dueDate;
    @Column(name = "customer_id") private Long customerId;
    @Column(name = "lead_id") private Long leadId;
    @Column(name = "created_by") private Long createdBy;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @Column(name = "updated_at") private LocalDateTime updatedAt;

    @PrePersist public void prePersist() {
        createdAt = updatedAt = LocalDateTime.now();
        if (status == null) status = "PENDING";
        if (priority == null) priority = "MEDIUM";
    }
    @PreUpdate public void preUpdate() { updatedAt = LocalDateTime.now(); }
}
