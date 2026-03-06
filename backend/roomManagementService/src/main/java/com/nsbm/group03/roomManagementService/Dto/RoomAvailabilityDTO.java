package com.nsbm.group03.roomManagementService.Dto;


import com.nsbm.group03.roomManagementService.Enum.RoomType;

public class RoomAvailabilityDTO {
    private String roomNumber;
    private RoomType roomType;
    private double pricePerNight;
    
    

    public RoomAvailabilityDTO() {}

    public RoomAvailabilityDTO(String roomNumber, RoomType roomType, double pricePerNight) {
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.pricePerNight = pricePerNight;
    }

    // Getters & Setters
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public RoomType getRoomType() { return roomType; }
    public void setRoomType(RoomType roomType) { this.roomType = roomType; }

    public double getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(double pricePerNight) { this.pricePerNight = pricePerNight; }
}