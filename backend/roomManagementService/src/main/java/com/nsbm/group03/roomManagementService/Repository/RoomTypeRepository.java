package com.nsbm.group03.roomManagementService.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nsbm.group03.roomManagementService.Entity.RoomTypeEntity;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomTypeEntity, String> {
    RoomTypeEntity findByRoomType(com.nsbm.group03.roomManagementService.Enum.RoomType type);

    
}
