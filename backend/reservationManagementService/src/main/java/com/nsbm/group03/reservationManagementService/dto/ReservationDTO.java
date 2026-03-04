package com.nsbm.group03.reservationManagementService.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDTO {

        private Long reservationId;
        private Long guestId;
        private GuestDTO guest;

        private String roomId;
        private LocalDate checkInDate;
        private LocalDate checkOutDate;

        private double totalAmount;
        private String specialRequests;

        private String status;
        private LocalDateTime createdAt;
}