package com.crm.customer.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_customers_gen")
    @SequenceGenerator(name = "seq_customers_gen", sequenceName = "seq_customers", allocationSize = 1)
    private Long id;

    @Column(name = "first_name", nullable = false, length = 100) private String firstName;
    @Column(name = "last_name", nullable = false, length = 100) private String lastName;
    @Column(nullable = false, unique = true, length = 150) private String email;
    @Column(length = 20) private String phone;
    @Column(length = 200) private String company;
    @Column(length = 100) private String industry;
    @Column(length = 50) private String status;
    @Column(length = 50) private String category;
    @Column(length = 500) private String address;
    @Column(length = 100) private String city;
    @Column(length = 100) private String country;
    @Column(name = "assigned_to") private Long assignedTo;
    @Column(name = "created_by") private Long createdBy;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @Column(name = "updated_at") private LocalDateTime updatedAt;

    @PrePersist public void prePersist() { createdAt = updatedAt = LocalDateTime.now(); }
    @PreUpdate public void preUpdate() { updatedAt = LocalDateTime.now(); }
}
