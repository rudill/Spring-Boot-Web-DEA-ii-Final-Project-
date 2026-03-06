package com.nsbm.group03.roomManagementService.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nsbm.group03.roomManagementService.Entity.Room;
import com.nsbm.group03.roomManagementService.Enum.RoomType;


@Repository
public interface RoomRepository extends JpaRepository<Room, String> {

    // Find room by room number
    Room findByRoomNumber(String roomNumber);

    long countByRoomType(RoomType type);

}

