package com.nsbm.group03.roomManagementService.Entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.nsbm.group03.roomManagementService.Enum.RoomStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;

@Entity
public class RoomStatusHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomStatus status;

    @Column(nullable = false)
    private String changedBy; // ADMIN / SYSTEM / MAINTENANCE

    @Column(nullable = false)
    private LocalDateTime changedAt;

    public RoomStatusHistory() {
    }

    public RoomStatusHistory(String id, Room room, LocalDate date, RoomStatus status, String changedBy,
            LocalDateTime changedAt) {
        this.id = id;
        this.room = room;
        this.date = date;
        this.status = status;
        this.changedBy = changedBy;
        this.changedAt = changedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public RoomStatus getStatus() {
        return status;
    }

    public void setStatus(RoomStatus status) {
        this.status = status;
    }

    public String getChangedBy() {
        return changedBy;
    }

    public void setChangedBy(String changedBy) {
        this.changedBy = changedBy;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }

    @PrePersist
    public void prePersist() {
        if (this.changedAt == null) {
            this.changedAt = LocalDateTime.now();
        }
        if (this.date == null) {
            this.date = LocalDate.now();
        }
    }

    @Override
    public String toString() {
        return "RoomStatusHistory [id=" + id + ", room=" + room + ", date=" + date + ", status=" + status
                + ", changedBy=" + changedBy + ", changedAt=" + changedAt + "]";
    }
}
