package com.nsbm.group03.eventManagementService.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "venues")
@Data
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer capacity;

    @Column(name = "price_per_hour", nullable = false)
    private Double pricePerHour;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}