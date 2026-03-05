package com.nsbm.group03.roomManagementService.Controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nsbm.group03.roomManagementService.Dto.RoomAvailabilityDTO;
import com.nsbm.group03.roomManagementService.Dto.RoomCountDTO;
import com.nsbm.group03.roomManagementService.Dto.RoomCreateDTO;
import com.nsbm.group03.roomManagementService.Dto.RoomDTO;
import com.nsbm.group03.roomManagementService.Dto.RoomStatusHistoryDTO;
import com.nsbm.group03.roomManagementService.Dto.RoomStatusUpdateDTO;
import com.nsbm.group03.roomManagementService.Dto.RoomTypeSummaryDTO;
import com.nsbm.group03.roomManagementService.Dto.StatisticsDTO;
import com.nsbm.group03.roomManagementService.Dto.StatisticsByTypeDTO;
import com.nsbm.group03.roomManagementService.Entity.Room;
import com.nsbm.group03.roomManagementService.Entity.RoomStatusHistory;
import com.nsbm.group03.roomManagementService.Enum.RoomType;
import com.nsbm.group03.roomManagementService.Mapper.RoomMapper;
import com.nsbm.group03.roomManagementService.Service.RoomService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(
    name = "Room Management Service",
    description = "Complete API for managing rooms, updating status, querying availability, and viewing room status history."
)
@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @Operation(summary = "Get all rooms",
            description = "Retrieve a complete list of all rooms in the system.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Rooms retrieved successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping
    public ResponseEntity<List<RoomDTO>> getAllRooms() {
        return ResponseEntity.ok(RoomMapper.toRoomDTOList(roomService.getAllRooms()));
    }

    @Operation(summary = "Get room count by type",
            description = "Retrieve the count of rooms grouped by type (SINGLE, DOUBLE, DELUXE) and total count.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Room counts retrieved successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping("/count")
    public ResponseEntity<RoomCountDTO> getRoomCountByType() {
        return ResponseEntity.ok(roomService.getRoomCountByType());
    }

    @Operation(summary = "Get room by room number",
            description = "Retrieve details of a specific room using its unique room number.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Room found"),
        @ApiResponse(responseCode = "404", description = "Room not found", content = @Content),
        @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping("/{roomNumber}")
    public ResponseEntity<RoomDTO> getRoomByNumber(
            @Parameter(description = "Unique room number", example = "101")
            @PathVariable String roomNumber) {

        Room room = roomService.getRoomByNumber(roomNumber);
        if (room == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);

        return ResponseEntity.ok(RoomMapper.toRoomDTO(room));
    }

    @Operation(summary = "Create new room",
            description = "Creates a new room and automatically generates 30 days of RoomStatusHistory with default AVAILABLE status.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Room created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data", content = @Content),
        @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PostMapping
    public ResponseEntity<RoomDTO> createRoom(
            @RequestBody RoomCreateDTO createDTO) {

        Room savedRoom = roomService.createRoomWithHistory(RoomMapper.toEntity(createDTO));

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(RoomMapper.toRoomDTO(savedRoom));
    }

    @Operation(summary = "Delete room",
            description = "Deletes a room and automatically removes all associated RoomStatusHistory records.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Room deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Room not found", content = @Content),
        @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @DeleteMapping("/{roomNumber}")
    public ResponseEntity<String> deleteRoom(
            @Parameter(description = "Unique room number", example = "101")
            @PathVariable String roomNumber) {

        Room room = roomService.getRoomByNumber(roomNumber);
        if (room == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Room not found.");

        roomService.deleteRoomWithHistory(roomNumber);
        return ResponseEntity.ok("Room and its history deleted successfully.");
    }

    @Operation(summary = "Update room status",
            description = "Manually updates today's status of a room (AVAILABLE, OCCUPIED, MAINTENANCE).")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Status updated successfully"),
        @ApiResponse(responseCode = "404", description = "Room not found", content = @Content)
    })
    @PatchMapping("/{roomNumber}/status")
    public ResponseEntity<RoomStatusHistoryDTO> updateRoomStatus(
            @PathVariable String roomNumber,
            @RequestBody RoomStatusUpdateDTO statusDTO) {

        RoomStatusHistory updated = roomService.updateRoomStatus(
                roomNumber,
                statusDTO.getStatus(),
                statusDTO.getChangedBy() != null ? statusDTO.getChangedBy() : "ADMIN");

        return ResponseEntity.ok(RoomMapper.toRoomStatusHistoryDTO(updated));
    }

    @Operation(summary = "Check-in room",
            description = "Marks the room as OCCUPIED for the current date.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Room checked-in successfully"),
        @ApiResponse(responseCode = "404", description = "Room not found", content = @Content)
    })
    @PostMapping("/{roomNumber}/check-in")
    public ResponseEntity<RoomStatusHistoryDTO> checkInRoom(
            @PathVariable String roomNumber,
            @RequestParam(defaultValue = "SYSTEM")
            @Parameter(description = "User performing the action", example = "ADMIN")
            String changedBy) {

        return ResponseEntity.ok(
                RoomMapper.toRoomStatusHistoryDTO(
                        roomService.checkInRoom(roomNumber, changedBy)));
    }

    @Operation(summary = "Check-out room",
            description = "Marks the room as AVAILABLE for the current date.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Room checked-out successfully"),
        @ApiResponse(responseCode = "404", description = "Room not found", content = @Content)
    })
    @PostMapping("/{roomNumber}/check-out")
    public ResponseEntity<RoomStatusHistoryDTO> checkOutRoom(
            @PathVariable String roomNumber,
            @RequestParam(defaultValue = "SYSTEM")
            @Parameter(description = "User performing the action", example = "ADMIN")
            String changedBy) {

        return ResponseEntity.ok(
                RoomMapper.toRoomStatusHistoryDTO(
                        roomService.checkOutRoom(roomNumber, changedBy)));
    }

    @Operation(summary = "Mark room for maintenance",
            description = "Marks the room as MAINTENANCE for the current date.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Room marked for maintenance"),
        @ApiResponse(responseCode = "404", description = "Room not found", content = @Content)
    })
    @PostMapping("/{roomNumber}/maintenance")
    public ResponseEntity<RoomStatusHistoryDTO> markForMaintenance(
            @PathVariable String roomNumber,
            @RequestParam(defaultValue = "MAINTENANCE")
            @Parameter(description = "User performing the action", example = "ADMIN")
            String changedBy) {

        return ResponseEntity.ok(
                RoomMapper.toRoomStatusHistoryDTO(
                        roomService.markRoomForMaintenance(roomNumber, changedBy)));
    }


    @Operation(summary = "Mark room available after maintenance",
            description = "Marks the room as AVAILABLE after maintenance is completed.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Room marked as available"),
        @ApiResponse(responseCode = "404", description = "Room not found", content = @Content)
    })
    @PostMapping("/{roomNumber}/available-after-maintenance")
    public ResponseEntity<RoomStatusHistoryDTO> markAvailableAfterMaintenance(
            @PathVariable String roomNumber,
            @RequestParam(defaultValue = "MAINTENANCE")
            @Parameter(description = "User performing the action", example = "ADMIN")
            String changedBy) {

        return ResponseEntity.ok(
                RoomMapper.toRoomStatusHistoryDTO(
                        roomService.markRoomAvailableAfterMaintenance(roomNumber, changedBy)));
    }

    @Operation(summary = "Get available rooms (today)",
            description = "Returns all rooms that are AVAILABLE today.")
    @ApiResponse(responseCode = "200", description = "Available rooms retrieved")
    @GetMapping("/available")
    public ResponseEntity<List<RoomAvailabilityDTO>> getAvailableRooms() {
        return ResponseEntity.ok(
                RoomMapper.toRoomAvailabilityDTOListFromHistory(
                        roomService.getAvailableRooms()));
    }

    @Operation(summary = "Get available rooms by date",
            description = "Returns all rooms that are AVAILABLE on a specified date.")
    @ApiResponse(responseCode = "200", description = "Available rooms retrieved")
    @GetMapping("/available/by-date")
    public ResponseEntity<List<RoomAvailabilityDTO>> getAvailableRoomsByDate(
            @RequestParam
            @Parameter(description = "Date in yyyy-MM-dd format", example = "2026-03-05")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date) {

        return ResponseEntity.ok(
                RoomMapper.toRoomAvailabilityDTOListFromHistory(
                        roomService.getAvailableRoomsByDate(date)));
    }

    @Operation(summary = "Get occupied rooms (today)")
    @ApiResponse(responseCode = "200", description = "Occupied rooms retrieved")
    @GetMapping("/occupied")
    public ResponseEntity<List<RoomStatusHistoryDTO>> getOccupiedRooms() {
        return ResponseEntity.ok(
                RoomMapper.toRoomStatusHistoryDTOList(
                        roomService.getOccupiedRooms()));
    }

    @Operation(summary = "Get occupied rooms by date")
    @ApiResponse(responseCode = "200", description = "Occupied rooms retrieved")
    @GetMapping("/occupied/by-date")
    public ResponseEntity<List<RoomStatusHistoryDTO>> getOccupiedRoomsByDate(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            @Parameter(description = "Date in yyyy-MM-dd format", example = "2026-03-05")
            LocalDate date) {

        return ResponseEntity.ok(
                RoomMapper.toRoomStatusHistoryDTOList(
                        roomService.getOccupiedRoomsByDate(date)));
    }

    @Operation(summary = "Get maintenance rooms (today)")
    @ApiResponse(responseCode = "200", description = "Maintenance rooms retrieved")
    @GetMapping("/maintenance")
    public ResponseEntity<List<RoomStatusHistoryDTO>> getMaintenanceRooms() {
        return ResponseEntity.ok(
                RoomMapper.toRoomStatusHistoryDTOList(
                        roomService.getMaintenanceRooms()));
    }

    @Operation(summary = "Get maintenance rooms by date")
    @ApiResponse(responseCode = "200", description = "Maintenance rooms retrieved")
    @GetMapping("/maintenance/by-date")
    public ResponseEntity<List<RoomStatusHistoryDTO>> getMaintenanceRoomsByDate(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            @Parameter(description = "Date in yyyy-MM-dd format", example = "2026-03-05")
            LocalDate date) {

        return ResponseEntity.ok(
                RoomMapper.toRoomStatusHistoryDTOList(
                        roomService.getMaintenanceRoomsByDate(date)));
    }

    @Operation(summary = "Get full status history of a room")
    @ApiResponse(responseCode = "200", description = "Room history retrieved")
    @GetMapping("/{roomNumber}/status-history")
    public ResponseEntity<List<RoomStatusHistoryDTO>> getRoomStatusHistory(
            @PathVariable String roomNumber) {

        return ResponseEntity.ok(
                RoomMapper.toRoomStatusHistoryDTOList(
                        roomService.getRoomStatusHistory(roomNumber)));
    }

    @Operation(summary = "Get room status history by date")
    @ApiResponse(responseCode = "200", description = "Room history retrieved")
    @GetMapping("/{roomNumber}/status-history/by-date")
    public ResponseEntity<List<RoomStatusHistoryDTO>> getRoomStatusHistoryByDate(
            @PathVariable String roomNumber,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date) {

        return ResponseEntity.ok(
                RoomMapper.toRoomStatusHistoryDTOList(
                        roomService.getRoomStatusHistoryByDate(roomNumber, date)));
    }

    @Operation(summary = "Get room status history by date range")
    @ApiResponse(responseCode = "200", description = "Room history retrieved")
    @GetMapping("/{roomNumber}/status-history/by-date-range")
    public ResponseEntity<List<RoomStatusHistoryDTO>> getRoomStatusHistoryByDateRange(
            @PathVariable String roomNumber,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        return ResponseEntity.ok(
                RoomMapper.toRoomStatusHistoryDTOList(
                        roomService.getRoomStatusHistoryByDateRange(roomNumber, startDate, endDate)));
    }

    @Operation(summary = "Get latest status of a room")
    @ApiResponse(responseCode = "200", description = "Latest status retrieved")
    @GetMapping("/{roomNumber}/latest-status")
    public ResponseEntity<RoomStatusHistoryDTO> getLatestRoomStatus(
            @PathVariable String roomNumber) {

        return ResponseEntity.ok(
                RoomMapper.toRoomStatusHistoryDTO(
                        roomService.getLatestRoomStatus(roomNumber)));
    }

    @Operation(summary = "Get all rooms status for a specific date (Admin overview)")
    @ApiResponse(responseCode = "200", description = "Status overview retrieved")
    @GetMapping("/history/by-date")
    public ResponseEntity<List<RoomStatusHistoryDTO>> getAllRoomsStatusHistoryByDate(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            @Parameter(description = "Date in yyyy-MM-dd format", example = "2026-03-05")
            LocalDate date) {

        return ResponseEntity.ok(
                RoomMapper.toRoomStatusHistoryDTOList(
                        roomService.getAllRoomsStatusHistoryByDate(date)));
    }

    

    @Operation(summary = "Get room types summary",
            description = "Retrieve summary information for all room types including pricing and capacity.")
    @ApiResponse(responseCode = "200", description = "Room types summary retrieved successfully")
    @GetMapping("/room-types/summary")
    public ResponseEntity<List<RoomTypeSummaryDTO>> getRoomTypeSummary() {
        return ResponseEntity.ok(roomService.getRoomTypeSummary());
    }

    @Operation(summary = "Get room type image",
            description = "Retrieve the image path for a specific room type.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Image path retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Room type not found", content = @Content)
    })
    @GetMapping("/room-types/{type}/image")
    public ResponseEntity<String> getRoomTypeImage(
            @Parameter(description = "Room type (SINGLE, DOUBLE, DELUXE)", example = "SINGLE")
            @PathVariable String type) {

        try {
            RoomType roomType = RoomType.valueOf(type.toUpperCase());
            String imagePath = roomService.getRoomTypeImage(roomType);

            if (imagePath == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Image not found for room type: " + type);
            }

            return ResponseEntity.ok(imagePath);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Invalid room type: " + type);
        }
    }

    @Operation(summary = "Get room statistics",
            description = "Retrieve overall room statistics including occupancy rates and revenue estimates.")
    @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully")
    @GetMapping("/statistics")
    public ResponseEntity<StatisticsDTO> getStatistics() {
        return ResponseEntity.ok(roomService.getStatistics());
    }

    @Operation(summary = "Get room statistics by type",
            description = "Retrieve detailed statistics broken down by room type.")
    @ApiResponse(responseCode = "200", description = "Statistics by type retrieved successfully")
    @GetMapping("/statistics/type")
    public ResponseEntity<StatisticsByTypeDTO> getStatisticsByType() {
        return ResponseEntity.ok(roomService.getStatisticsByType());
    }

}
