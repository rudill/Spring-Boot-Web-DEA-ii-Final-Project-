package com.nsbm.group03.roomManagementService.Mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.nsbm.group03.roomManagementService.Dto.RoomAvailabilityDTO;
import com.nsbm.group03.roomManagementService.Dto.RoomCreateDTO;
import com.nsbm.group03.roomManagementService.Dto.RoomDTO;
import com.nsbm.group03.roomManagementService.Dto.RoomStatusHistoryDTO;
import com.nsbm.group03.roomManagementService.Dto.RoomStatusUpdateDTO;
import com.nsbm.group03.roomManagementService.Entity.Room;
import com.nsbm.group03.roomManagementService.Entity.RoomStatusHistory;
import com.nsbm.group03.roomManagementService.Enum.RoomStatus;

// Mapper class to convert between Room entity and various DTOs
public class RoomMapper {

    // ========== ROOM ENTITY MAPPINGS ==========

    // Entity → RoomDTO
    public static RoomDTO toRoomDTO(Room room) {
        if (room == null) return null;
        return new RoomDTO(
            room.getRoomNumber(),
            room.getRoomType(),
            room.getPricePerNight(),
            room.getCapacity(),
            room.getStatus()
        );
    }

    // Entity → RoomAvailabilityDTO
    public static RoomAvailabilityDTO toRoomAvailabilityDTO(Room room) {
        if (room == null) return null;
        return new RoomAvailabilityDTO(
            room.getRoomNumber(),
            room.getRoomType(),
            room.getPricePerNight()
        );
    }

    // RoomDTO → Entity
    public static Room toEntity(RoomDTO dto) {
        if (dto == null) return null;
        Room room = new Room();
        room.setRoomNumber(dto.getRoomNumber());
        room.setRoomType(dto.getRoomType());
        room.setPricePerNight(dto.getPricePerNight());
        room.setCapacity(dto.getCapacity());
        room.setStatus(dto.getStatus());
        return room;
    }

    // RoomCreateDTO → Entity
    public static Room toEntity(RoomCreateDTO dto) {
        if (dto == null) return null;
        Room room = new Room();
        room.setRoomNumber(dto.getRoomNumber());
        room.setRoomType(dto.getRoomType());
        room.setPricePerNight(dto.getPricePerNight());
        room.setCapacity(dto.getCapacity());
        room.setStatus(RoomStatus.AVAILABLE);
        return room;
    }

    // RoomStatusUpdateDTO → Entity
    public static Room toEntity(RoomStatusUpdateDTO dto) {
        if (dto == null) return null;
        Room room = new Room();        
        room.setRoomNumber(dto.getRoomNumber());
        room.setStatus(dto.getStatus());
        return room;
    }

    // ========== ROOM STATUS HISTORY MAPPINGS ==========

    // RoomStatusHistory Entity → RoomStatusHistoryDTO
    public static RoomStatusHistoryDTO toRoomStatusHistoryDTO(RoomStatusHistory statusHistory) {
        if (statusHistory == null) return null;
        return new RoomStatusHistoryDTO(
            statusHistory.getId(),
            statusHistory.getRoom().getRoomNumber(),
            statusHistory.getRoom().getRoomId(),
            statusHistory.getDate(),
            statusHistory.getStatus(),
            statusHistory.getChangedBy(),
            statusHistory.getChangedAt()
        );
    }

    // RoomStatusHistoryDTO → Entity
    public static RoomStatusHistory toEntity(RoomStatusHistoryDTO dto, Room room) {
        if (dto == null) return null;
        RoomStatusHistory statusHistory = new RoomStatusHistory();
        statusHistory.setId(dto.getId());
        statusHistory.setRoom(room);
        statusHistory.setDate(dto.getDate());
        statusHistory.setStatus(dto.getStatus());
        statusHistory.setChangedBy(dto.getChangedBy());
        statusHistory.setChangedAt(dto.getChangedAt());
        return statusHistory;
    }

    // Alternative mapping for RoomStatusHistory from Status History with room number
    public static RoomAvailabilityDTO toRoomAvailabilityDTO(RoomStatusHistory statusHistory) {
        if (statusHistory == null) return null;
        return new RoomAvailabilityDTO(
            statusHistory.getRoom().getRoomNumber(),
            statusHistory.getRoom().getRoomType(),
            statusHistory.getRoom().getPricePerNight()
        );
    }

    // ========== BATCH MAPPINGS ==========

    // Batch mapping: List<Room> → List<RoomDTO>
    public static List<RoomDTO> toRoomDTOList(List<Room> rooms) {
        return rooms.stream()
            .map(RoomMapper::toRoomDTO)
            .collect(Collectors.toList());
    }

    // Batch mapping: List<RoomStatusHistory> → List<RoomAvailabilityDTO>
    public static List<RoomAvailabilityDTO> toRoomAvailabilityDTOListFromHistory(List<RoomStatusHistory> statusHistories) {
        return statusHistories.stream()
            .map(RoomMapper::toRoomAvailabilityDTO)
            .collect(Collectors.toList());
    }

    // Batch mapping: List<RoomStatusHistory> → List<RoomStatusHistoryDTO>
    public static List<RoomStatusHistoryDTO> toRoomStatusHistoryDTOList(List<RoomStatusHistory> statusHistories) {
        return statusHistories.stream()
            .map(RoomMapper::toRoomStatusHistoryDTO)
            .collect(Collectors.toList());
    }

}
