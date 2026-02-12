package com.nsbm.group03.reservationManagementService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class GuestDTO {
    private Long guestId;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String nic;
    private String email;
}
