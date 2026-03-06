package com.nsbm.group03.roomManagementService.Dto;

/**
 * DTO for room count statistics by type
 */
public class RoomCountDTO {

    private long singleRooms;
    private long doubleRooms;
    private long deluxeRooms;
    private long totalRooms;

    public RoomCountDTO() {}

    public RoomCountDTO(long singleRooms, long doubleRooms, long deluxeRooms) {
        this.singleRooms = singleRooms;
        this.doubleRooms = doubleRooms;
        this.deluxeRooms = deluxeRooms;
        this.totalRooms = singleRooms + doubleRooms + deluxeRooms;
    }

    // Getters and Setters
    public long getSingleRooms() {
        return singleRooms;
    }

    public void setSingleRooms(long singleRooms) {
        this.singleRooms = singleRooms;
    }

    public long getDoubleRooms() {
        return doubleRooms;
    }

    public void setDoubleRooms(long doubleRooms) {
        this.doubleRooms = doubleRooms;
    }

    public long getDeluxeRooms() {
        return deluxeRooms;
    }

    public void setDeluxeRooms(long deluxeRooms) {
        this.deluxeRooms = deluxeRooms;
    }

    public long getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(long totalRooms) {
        this.totalRooms = totalRooms;
    }
}