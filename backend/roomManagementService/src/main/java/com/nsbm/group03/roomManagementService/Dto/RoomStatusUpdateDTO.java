package com.nsbm.group03.roomManagementService.Dto;

import com.nsbm.group03.roomManagementService.Enum.RoomStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RoomStatusUpdateDTO {

    
    @NotBlank
    private String roomNumber;

    @NotNull
    private RoomStatus status;

    private String changedBy;

    public RoomStatusUpdateDTO() {}

    public RoomStatusUpdateDTO(String roomNumber, RoomStatus status) {
        this.roomNumber = roomNumber;
        this.status = status;
    }

    public RoomStatusUpdateDTO(String roomNumber, RoomStatus status, String changedBy) {
        this.roomNumber = roomNumber;
        this.status = status;
        this.changedBy = changedBy;
    }

    // Getters & Setters
    
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public RoomStatus getStatus() { return status; }
    public void setStatus(RoomStatus status) { this.status = status; }

    public String getChangedBy() { return changedBy; }
    public void setChangedBy(String changedBy) { this.changedBy = changedBy; }
}
