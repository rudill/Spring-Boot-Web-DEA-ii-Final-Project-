package com.nsbm.group03.reservationManagementService.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reservationId;

    @ManyToOne
    @JoinColumn(name = "guest_id", nullable = false)
    private Guest guest;

    private String roomId;

    private LocalDate checkInDate;
    private LocalDate checkOutDate;

    private double totalAmount;
    private String specialRequests;

    private String status;

    private LocalDateTime createdAt;
}