package com.nsbm.group03.roomManagementService.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.nsbm.group03.roomManagementService.Entity.Room;
import com.nsbm.group03.roomManagementService.Entity.RoomStatusHistory;
import com.nsbm.group03.roomManagementService.Enum.RoomStatus;


@Repository
public interface RoomStatusHistoryRepository extends JpaRepository<RoomStatusHistory, String> {

    // Find all status history for a specific room ordered by date descending
    List<RoomStatusHistory> findByRoomOrderByDateDesc(Room room);

    // Find all status history for a specific room by date
    List<RoomStatusHistory> findByRoomAndDate(Room room, LocalDate date);

    // Find all status history for a specific room between two dates
    List<RoomStatusHistory> findByRoomAndDateBetweenOrderByDateDesc(Room room, LocalDate startDate, LocalDate endDate);

    // Find all status history for a specific room with a specific status
    List<RoomStatusHistory> findByRoomAndStatus(Room room, RoomStatus status);

    // Find all status history for a specific date
    List<RoomStatusHistory> findByDateOrderByChangedAtDesc(LocalDate date);

    // Find all status history with a specific status
    List<RoomStatusHistory> findByStatusOrderByChangedAtDesc(RoomStatus status);

    // Find all status history for a specific status on a specific date
    List<RoomStatusHistory> findByStatusAndDateOrderByChangedAtDesc(RoomStatus status, LocalDate date);

    // Find the latest status history for a specific room
    @Query("SELECT rsh FROM RoomStatusHistory rsh WHERE rsh.room = :room ORDER BY rsh.changedAt DESC LIMIT 1")
    RoomStatusHistory findLatestStatusByRoom(@Param("room") Room room);

    // Find all occupied rooms for a specific date
    @Query("SELECT rsh FROM RoomStatusHistory rsh WHERE rsh.date = :date AND rsh.status = 'OCCUPIED' ORDER BY rsh.changedAt DESC")
    List<RoomStatusHistory> findOccupiedRoomsByDate(@Param("date") LocalDate date);

    // Find all available rooms for a specific date
    @Query("SELECT rsh FROM RoomStatusHistory rsh WHERE rsh.date = :date AND rsh.status = 'AVAILABLE' ORDER BY rsh.changedAt DESC")
    List<RoomStatusHistory> findAvailableRoomsByDate(@Param("date") LocalDate date);

    // Find all maintenance rooms for a specific date
    @Query("SELECT rsh FROM RoomStatusHistory rsh WHERE rsh.date = :date AND rsh.status = 'MAINTENANCE' ORDER BY rsh.changedAt DESC")
    List<RoomStatusHistory> findMaintenanceRoomsByDate(@Param("date") LocalDate date);

    // Find all rooms in maintenance
    List<RoomStatusHistory> findByStatusOrderByDateDesc(RoomStatus status);

}
