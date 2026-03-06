package com.nsbm.group03.roomManagementService.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;

import com.nsbm.group03.roomManagementService.Entity.Room;
import com.nsbm.group03.roomManagementService.Entity.RoomStatusHistory;
import com.nsbm.group03.roomManagementService.Entity.RoomTypeEntity;
import com.nsbm.group03.roomManagementService.Enum.RoomStatus;
import com.nsbm.group03.roomManagementService.Enum.RoomType;
import com.nsbm.group03.roomManagementService.Dto.RoomCountDTO;
import com.nsbm.group03.roomManagementService.Dto.RoomTypeSummaryDTO;
import com.nsbm.group03.roomManagementService.Dto.StatisticsDTO;
import com.nsbm.group03.roomManagementService.Dto.StatisticsByTypeDTO;
import com.nsbm.group03.roomManagementService.Repository.RoomRepository;
import com.nsbm.group03.roomManagementService.Repository.RoomStatusHistoryRepository;
import com.nsbm.group03.roomManagementService.Repository.RoomTypeRepository;

@Service
public class RoomService {
    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomStatusHistoryRepository statusHistoryRepository;

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    

    // ========== ROOM MANAGEMENT ==========

    // View all rooms
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    // Basic create (no history generation)
    public Room insertRoom(Room room) {
        if (room.getStatus() == null) {
            room.setStatus(RoomStatus.AVAILABLE);
        }
        return roomRepository.save(room);        
    }

    // Create a room and automatically populate 30 days of random status history
    public Room createRoomWithHistory(Room room) {
        // avoid duplicates by roomNumber
        Room existing = getRoomByNumber(room.getRoomNumber());
        if (existing != null) {
            return existing;
        }
        if (room.getStatus() == null) {
            room.setStatus(RoomStatus.AVAILABLE);
        }
        Room saved = roomRepository.save(room);
        generateHistoryForRoom(saved, 30);
        System.out.println("Generated history for room " + saved.getRoomNumber());
        return saved;
    }

    // Delete a room along with its history (cascade handles history removal)
    public void deleteRoomWithHistory(String roomNumber) {
        Room room = getRoomByNumber(roomNumber);
        if (room != null) {
            roomRepository.delete(room);
            System.out.println("Deleted room " + roomNumber + " and its history");
        }
    }

    // Get a room by room number  
    public Room getRoomByNumber(String roomNumber) {
        return roomRepository.findByRoomNumber(roomNumber);
    }

    // Get room count statistics by type
    public RoomCountDTO getRoomCountByType() {
        long singleCount = roomRepository.countByRoomType(RoomType.SINGLE);
        long doubleCount = roomRepository.countByRoomType(RoomType.DOUBLE);
        long deluxeCount = roomRepository.countByRoomType(RoomType.DELUXE);

        return new RoomCountDTO(singleCount, doubleCount, deluxeCount);
    }

    // Delete a room by room number
    public void deleteRoom(String roomNumber) {
        Room room = getRoomByNumber(roomNumber);
        if (room != null) {
            roomRepository.delete(room);
        }
    }

    // ========== ROOM STATUS MANAGEMENT ==========

    // Update room status and create status history
    public RoomStatusHistory updateRoomStatus(String roomNumber, RoomStatus newStatus, String changedBy) {
        Room room = getRoomByNumber(roomNumber);
        if (room == null) {
            throw new RuntimeException("Room with number " + roomNumber + " not found");
        }

        // Update the room status
        room.setStatus(newStatus);
        roomRepository.save(room);

        // Create status history record
        RoomStatusHistory statusHistory = new RoomStatusHistory();
        statusHistory.setRoom(room);
        statusHistory.setStatus(newStatus);
        statusHistory.setDate(LocalDate.now());
        statusHistory.setChangedBy(changedBy);
        statusHistory.setChangedAt(LocalDateTime.now());

        return statusHistoryRepository.save(statusHistory);
    }

    // Update room status for a specific date
    public RoomStatusHistory updateRoomStatusForDate(String roomNumber, RoomStatus newStatus, LocalDate date, String changedBy) {
        Room room = getRoomByNumber(roomNumber);
        if (room == null) {
            throw new RuntimeException("Room with number " + roomNumber + " not found");
        }

        RoomStatusHistory statusHistory = new RoomStatusHistory();
        statusHistory.setRoom(room);
        statusHistory.setStatus(newStatus);
        statusHistory.setDate(date);
        statusHistory.setChangedBy(changedBy);
        statusHistory.setChangedAt(LocalDateTime.now());

        return statusHistoryRepository.save(statusHistory);
    }

    // Mark room as occupied (when guest checks in)
    public RoomStatusHistory checkInRoom(String roomNumber, String changedBy) {
        return updateRoomStatus(roomNumber, RoomStatus.OCCUPIED, changedBy);
    }

    // Mark room as available (when guest checks out)
    public RoomStatusHistory checkOutRoom(String roomNumber, String changedBy) {
        return updateRoomStatus(roomNumber, RoomStatus.AVAILABLE, changedBy);
    }

    // Mark room for maintenance
    public RoomStatusHistory markRoomForMaintenance(String roomNumber, String changedBy) {
        return updateRoomStatus(roomNumber, RoomStatus.MAINTENANCE, changedBy);
    }

    // Mark room as available after maintenance
    public RoomStatusHistory markRoomAvailableAfterMaintenance(String roomNumber, String changedBy) {
        return updateRoomStatus(roomNumber, RoomStatus.AVAILABLE, changedBy);
    }

    // ========== ROOM STATUS QUERIES ==========

    // Get only available rooms
    public List<RoomStatusHistory> getAvailableRooms() {
        LocalDate today = LocalDate.now();
        return statusHistoryRepository.findAvailableRoomsByDate(today);
    }

    // Get available rooms for a specific date
    public List<RoomStatusHistory> getAvailableRoomsByDate(LocalDate date) {
        return statusHistoryRepository.findAvailableRoomsByDate(date);
    }

    // Get occupied rooms for today
    public List<RoomStatusHistory> getOccupiedRooms() {
        LocalDate today = LocalDate.now();
        return statusHistoryRepository.findOccupiedRoomsByDate(today);
    }

    // Get occupied rooms for a specific date
    public List<RoomStatusHistory> getOccupiedRoomsByDate(LocalDate date) {
        return statusHistoryRepository.findOccupiedRoomsByDate(date);
    }

    // Get maintenance rooms for today
    public List<RoomStatusHistory> getMaintenanceRooms() {
        LocalDate today = LocalDate.now();
        return statusHistoryRepository.findMaintenanceRoomsByDate(today);
    }

    // Get maintenance rooms for a specific date
    public List<RoomStatusHistory> getMaintenanceRoomsByDate(LocalDate date) {
        return statusHistoryRepository.findMaintenanceRoomsByDate(date);
    }

    // ========== ROOM STATUS HISTORY QUERIES ==========

    // Get complete status history for a room
    public List<RoomStatusHistory> getRoomStatusHistory(String roomNumber) {
        Room room = getRoomByNumber(roomNumber);
        if (room == null) {
            throw new RuntimeException("Room with number " + roomNumber + " not found");
        }
        return statusHistoryRepository.findByRoomOrderByDateDesc(room);
    }

    // Get status history for a room on a specific date
    public List<RoomStatusHistory> getRoomStatusHistoryByDate(String roomNumber, LocalDate date) {
        Room room = getRoomByNumber(roomNumber);
        if (room == null) {
            throw new RuntimeException("Room with number " + roomNumber + " not found");
        }
        return statusHistoryRepository.findByRoomAndDate(room, date);
    }

    // Get status history for a room within a date range
    public List<RoomStatusHistory> getRoomStatusHistoryByDateRange(String roomNumber, LocalDate startDate, LocalDate endDate) {
        Room room = getRoomByNumber(roomNumber);
        if (room == null) {
            throw new RuntimeException("Room with number " + roomNumber + " not found");
        }
        return statusHistoryRepository.findByRoomAndDateBetweenOrderByDateDesc(room, startDate, endDate);
    }

    // Get latest status for a room
    public RoomStatusHistory getLatestRoomStatus(String roomNumber) {
        Room room = getRoomByNumber(roomNumber);
        if (room == null) {
            throw new RuntimeException("Room with number " + roomNumber + " not found");
        }
        return statusHistoryRepository.findLatestStatusByRoom(room);
    }

    // Get status history for all rooms on a specific date
    public List<RoomStatusHistory> getAllRoomsStatusHistoryByDate(LocalDate date) {
        return statusHistoryRepository.findByDateOrderByChangedAtDesc(date);
    }

    // Get all rooms with a specific status
    public List<RoomStatusHistory> getRoomsByStatus(RoomStatus status) {
        return statusHistoryRepository.findByStatusOrderByDateDesc(status);
    }

    // ----------------------- history assistance -----------------------

    /**
     * Generate missing status history entries for a room for the next n days.
     * If an entry already exists for a date it will be skipped (idempotent).
     * History is added with random status based on configured probabilities.
     */
    public void generateHistoryForRoom(Room room, int daysAhead) {
        LocalDate today = LocalDate.now();
        for (int i = 0; i < daysAhead; i++) {
            LocalDate date = today.plusDays(i);
            // skip if already present
            List<RoomStatusHistory> existing = statusHistoryRepository.findByRoomAndDate(room, date);
            if (!existing.isEmpty()) continue;

            RoomStatus randomStatus = pickRandomStatus();
            RoomStatusHistory history = new RoomStatusHistory();
            history.setRoom(room);
            history.setDate(date);
            history.setStatus(randomStatus);
            history.setChangedBy("SYSTEM");
            history.setChangedAt(LocalDateTime.now());
            statusHistoryRepository.save(history);
        }
    }

    private RoomStatus pickRandomStatus() {
        double r = Math.random();
        if (r < 0.7) return RoomStatus.AVAILABLE;
        if (r < 0.9) return RoomStatus.OCCUPIED;
        return RoomStatus.MAINTENANCE;
    }

    // scheduled job ensures each room always has at least 30 days of history ahead
    @Scheduled(cron = "0 0 0 * * ?") // every midnight
    public void refreshHistory() {
        List<Room> rooms = getAllRooms();
        for (Room r : rooms) {
            generateHistoryForRoom(r, 30);
        }
        System.out.println("[Scheduled] room status history refreshed for " + rooms.size() + " rooms");
    }

    // ========== ADDITIONAL ENDPOINTS ==========

    /**
     * Get room type summary information
     */
    public List<RoomTypeSummaryDTO> getRoomTypeSummary() {
        // Ensure room types exist (fallback if DataInitializer didn't run)
        ensureRoomTypesExist();
        
        List<RoomTypeEntity> roomTypes = roomTypeRepository.findAll();
        return roomTypes.stream()
                .map(entity -> new RoomTypeSummaryDTO(
                        entity.getRoomType().toString(),
                        entity.getPricePerNight(),
                        entity.getRoomType() == RoomType.SINGLE ? 1 : 2, // capacity based on type
                        entity.getImagePath()
                ))
                .toList();
    }

    /**
     * Get room type image path
     */
    public String getRoomTypeImage(RoomType roomType) {
        // Ensure room types exist (fallback if DataInitializer didn't run)
        ensureRoomTypesExist();
        
        RoomTypeEntity entity = roomTypeRepository.findByRoomType(roomType);
        return entity != null ? entity.getImagePath() : "Image not found for room type: " + roomType;
    }

    /**
     * Ensure room types exist in database (fallback method)
     */
    private void ensureRoomTypesExist() {
        // Check and create SINGLE type
        if (roomTypeRepository.findByRoomType(RoomType.SINGLE) == null) {
            RoomTypeEntity singleType = new RoomTypeEntity();
            singleType.setRoomType(RoomType.SINGLE);
            singleType.setPricePerNight(5000.0);
            singleType.setImagePath("/Upload/Single.jpg");
            roomTypeRepository.saveAndFlush(singleType);
        }
        
        // Check and create DOUBLE type
        if (roomTypeRepository.findByRoomType(RoomType.DOUBLE) == null) {
            RoomTypeEntity doubleType = new RoomTypeEntity();
            doubleType.setRoomType(RoomType.DOUBLE);
            doubleType.setPricePerNight(8000.0);
            doubleType.setImagePath("/Upload/Double.jpg");
            roomTypeRepository.saveAndFlush(doubleType);
        }
        
        // Check and create DELUXE type
        if (roomTypeRepository.findByRoomType(RoomType.DELUXE) == null) {
            RoomTypeEntity deluxeType = new RoomTypeEntity();
            deluxeType.setRoomType(RoomType.DELUXE);
            deluxeType.setPricePerNight(12000.0);
            deluxeType.setImagePath("/Upload/Deluxe.jpg");
            roomTypeRepository.saveAndFlush(deluxeType);
        }
    }

    /**
     * Get overall room statistics
     */
    public StatisticsDTO getStatistics() {
        int totalRooms = (int) roomRepository.count();
        int availableRooms = getAvailableRooms().size();
        int occupiedRooms = getOccupiedRooms().size();
        int maintenanceRooms = getMaintenanceRooms().size();

        return new StatisticsDTO(totalRooms, availableRooms, occupiedRooms, maintenanceRooms);
    }

    /**
     * Get statistics broken down by room type
     */
    public StatisticsByTypeDTO getStatisticsByType() {
        List<Room> allRooms = getAllRooms();
        java.util.Map<String, StatisticsByTypeDTO.TypeStatistics> statsMap = new java.util.HashMap<>();

        // Initialize stats for each room type
        for (RoomType type : RoomType.values()) {
            RoomTypeEntity typeEntity = roomTypeRepository.findByRoomType(type);
            double price = typeEntity != null ? typeEntity.getPricePerNight() : 0.0;
            statsMap.put(type.toString(), new StatisticsByTypeDTO.TypeStatistics(type.toString(), 0, 0, 0, 0, price));
        }

        // Count rooms by type and status
        for (Room room : allRooms) {
            String typeKey = room.getRoomType().toString();
            StatisticsByTypeDTO.TypeStatistics stats = statsMap.get(typeKey);

            if (stats != null) {
                stats.setTotal(stats.getTotal() + 1);

                // Get latest status for this room
                RoomStatusHistory latestStatus = statusHistoryRepository.findLatestStatusByRoom(room);
                if (latestStatus != null) {
                    RoomStatus status = latestStatus.getStatus();
                    if (status == RoomStatus.AVAILABLE) {
                        stats.setAvailable(stats.getAvailable() + 1);
                    } else if (status == RoomStatus.OCCUPIED) {
                        stats.setOccupied(stats.getOccupied() + 1);
                    } else if (status == RoomStatus.MAINTENANCE) {
                        stats.setMaintenance(stats.getMaintenance() + 1);
                    }
                }
            }
        }

        return new StatisticsByTypeDTO(statsMap);
    }

}
