package com.nsbm.group03.reservationManagementService.repository;

import com.nsbm.group03.reservationManagementService.entity.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface GuestRepository extends JpaRepository<Guest,Long> {

    @Query(value = "SELECT * FROM guest WHERE phone_number = ?1", nativeQuery = true)
    Guest findByPhoneNumber(String phoneNumber);

}
