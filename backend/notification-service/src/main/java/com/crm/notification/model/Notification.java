package com.crm.notification.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "notifications")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "user_id") private Long userId;
    @Column(length = 200) private String title;
    @Lob private String message;
    @Column(length = 50) private String type;
    @Column(name = "is_read") private Integer isRead = 0;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @PrePersist public void prePersist() { createdAt = LocalDateTime.now(); if (isRead == null) isRead = 0; }
}
