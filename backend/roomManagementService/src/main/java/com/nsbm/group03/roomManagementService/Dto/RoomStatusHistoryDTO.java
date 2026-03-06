package com.nsbm.group03.roomManagementService.Dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.nsbm.group03.roomManagementService.Enum.RoomStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

// DTO for RoomStatusHistory
public class RoomStatusHistoryDTO {

    private String id;
    
    @NotBlank
    private String roomNumber;

    @NotBlank
    private String roomId;

    @NotNull
    private LocalDate date;

    @NotNull
    private RoomStatus status;

    @NotBlank
    private String changedBy;

    @NotNull
    private LocalDateTime changedAt;

    public RoomStatusHistoryDTO() {}

    public RoomStatusHistoryDTO(String id, String roomNumber, String roomId, LocalDate date, RoomStatus status, 
                               String changedBy, LocalDateTime changedAt) {
        this.id = id;
        this.roomNumber = roomNumber;
        this.roomId = roomId;
        this.date = date;
        this.status = status;
        this.changedBy = changedBy;
        this.changedAt = changedAt;
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public RoomStatus getStatus() { return status; }
    public void setStatus(RoomStatus status) { this.status = status; }

    public String getChangedBy() { return changedBy; }
    public void setChangedBy(String changedBy) { this.changedBy = changedBy; }

    public LocalDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }

    @Override
    public String toString() {
        return "RoomStatusHistoryDTO [id=" + id + ", roomNumber=" + roomNumber + ", roomId=" + roomId + ", date="
                + date + ", status=" + status + ", changedBy=" + changedBy + ", changedAt=" + changedAt + "]";
    }
}
