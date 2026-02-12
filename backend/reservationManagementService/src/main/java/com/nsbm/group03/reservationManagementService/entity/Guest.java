package com.nsbm.group03.reservationManagementService.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Guest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long guestId;

    private String firstName;
    private String lastName;

    @Column(unique = true)
    private String phoneNumber;

    @Column(unique = true)
    private String nic;

    private String email;

}
