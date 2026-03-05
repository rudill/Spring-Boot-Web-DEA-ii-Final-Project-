package com.nsbm.group03.roomManagementService.Dto;

/**
 * DTO for room type summary information
 */
public class RoomTypeSummaryDTO {

    private String roomType;
    private double pricePerNight;
    private int capacity;
    private String imagePath;

    public RoomTypeSummaryDTO() {}

    public RoomTypeSummaryDTO(String roomType, double pricePerNight, int capacity, String imagePath) {
        this.roomType = roomType;
        this.pricePerNight = pricePerNight;
        this.capacity = capacity;
        this.imagePath = imagePath;
    }

    // Getters and Setters
    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public double getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(double pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
}