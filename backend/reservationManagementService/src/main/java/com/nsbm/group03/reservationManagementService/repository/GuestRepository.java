package com.nsbm.group03.reservationManagementService.repository;

import com.nsbm.group03.reservationManagementService.entity.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface GuestRepository extends JpaRepository<Guest, Long> {

    Guest findByNic(String nic);

}
