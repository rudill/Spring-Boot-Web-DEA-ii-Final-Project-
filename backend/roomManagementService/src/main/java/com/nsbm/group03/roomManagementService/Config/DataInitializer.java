package com.nsbm.group03.roomManagementService.Config;

import java.util.UUID;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.orm.ObjectOptimisticLockingFailureException;

import com.nsbm.group03.roomManagementService.Entity.Room;
import com.nsbm.group03.roomManagementService.Entity.RoomTypeEntity;
import com.nsbm.group03.roomManagementService.Enum.RoomType;
import com.nsbm.group03.roomManagementService.Repository.RoomTypeRepository;
import com.nsbm.group03.roomManagementService.Service.RoomService;

/**
 * Populates the database with initial room types and a set of rooms.  
 * Uses createRoomWithHistory so histories are generated automatically.
 * The runner is idempotent - repeated starts will not insert duplicates.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final RoomTypeRepository typeRepo;
    private final RoomService roomService;

    public DataInitializer(RoomTypeRepository typeRepo, RoomService roomService) {
        this.typeRepo = typeRepo;
        this.roomService = roomService;
    }

    @Override
    public void run(String... args) throws Exception {
        // Create three room types with fixed UUIDs for idempotency
        
        // SINGLE room type
        RoomTypeEntity singleType = typeRepo.findByRoomType(RoomType.SINGLE);
        if (singleType == null) {
            try {
                singleType = new RoomTypeEntity("room-type-single", RoomType.SINGLE, 5000.0, "/Upload/Single.jpg");
                typeRepo.saveAndFlush(singleType);
            } catch (DataIntegrityViolationException | ObjectOptimisticLockingFailureException e) {
                // already exists, fetch it again
                singleType = typeRepo.findByRoomType(RoomType.SINGLE);
            }
        }

        // DOUBLE room type
        RoomTypeEntity doubleType = typeRepo.findByRoomType(RoomType.DOUBLE);
        if (doubleType == null) {
            try {
                doubleType = new RoomTypeEntity("room-type-double", RoomType.DOUBLE, 8000.0, "/Upload/Double.jpg");
                typeRepo.saveAndFlush(doubleType);
            } catch (DataIntegrityViolationException | ObjectOptimisticLockingFailureException e) {
                // already exists, fetch it again
                doubleType = typeRepo.findByRoomType(RoomType.DOUBLE);
            }
        }

        // DELUXE room type
        RoomTypeEntity deluxeType = typeRepo.findByRoomType(RoomType.DELUXE);
        if (deluxeType == null) {
            try {
                deluxeType = new RoomTypeEntity("room-type-deluxe", RoomType.DELUXE, 12000.0, "/Upload/Deluxe.jpg");
                typeRepo.saveAndFlush(deluxeType);
            } catch (DataIntegrityViolationException | ObjectOptimisticLockingFailureException e) {
                // already exists, fetch it again
                deluxeType = typeRepo.findByRoomType(RoomType.DELUXE);
            }
        }

        // Generate 10 rooms of each type if they don't already exist
        for (RoomType type : RoomType.values()) {
            for (int i = 1; i <= 10; i++) {
                String roomNumber;
                switch (type) {
                    case SINGLE: roomNumber = "1" + String.format("%02d", i); break;
                    case DOUBLE: roomNumber = "2" + String.format("%02d", i); break;
                    case DELUXE: roomNumber = "3" + String.format("%02d", i); break;
                    default: roomNumber = "x" + i;
                }

                // Skip if room already exists
                if (roomService.getRoomByNumber(roomNumber) != null) {
                    continue;
                }

                Room room = new Room();
                room.setRoomId(UUID.randomUUID().toString());
                room.setRoomNumber(roomNumber);
                room.setRoomType(type);
                room.setPricePerNight(type == RoomType.SINGLE ? 5000.0
                        : type == RoomType.DOUBLE ? 8000.0 : 12000.0);
                room.setCapacity(type == RoomType.SINGLE ? 1 : 2);
                room.setStatus(null); // will default to AVAILABLE

                roomService.createRoomWithHistory(room);
            }
        }

        System.out.println("Sample data initialization complete.");
    }
}
