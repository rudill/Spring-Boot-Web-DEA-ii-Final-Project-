package com.nsbm.group03.roomManagementService.Entity;
import com.nsbm.group03.roomManagementService.Enum.RoomType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class RoomTypeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private RoomType roomType; 

    private double pricePerNight;

    private String imagePath; 

    public RoomTypeEntity() {
    }

    public RoomTypeEntity(String id, RoomType roomType, double pricePerNight, String imagePath) {
        this.id = id;
        this.roomType = roomType;
        this.pricePerNight = pricePerNight;
        this.imagePath = imagePath;
    }

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public RoomType getRoomType() {
        return roomType;
    }
    public void setRoomType(RoomType roomType) {
        this.roomType = roomType;
    }
    public double getPricePerNight() {
        return pricePerNight;
    }
    public void setPricePerNight(double pricePerNight) {
        this.pricePerNight = pricePerNight;
    }
    
    public String getImagePath() {
        return imagePath;
    }
    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }




}