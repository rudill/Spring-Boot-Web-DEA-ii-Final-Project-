package com.nsbm.group03.roomManagementService.Dto;

/**
 * DTO for overall room statistics
 */
public class StatisticsDTO {

    private int totalRooms;
    private int availableRooms;
    private int occupiedRooms;
    private int maintenanceRooms;
    private double occupancyRate; // percentage
    private double revenueToday; // estimated based on occupied rooms

    public StatisticsDTO() {}

    public StatisticsDTO(int totalRooms, int availableRooms, int occupiedRooms, int maintenanceRooms) {
        this.totalRooms = totalRooms;
        this.availableRooms = availableRooms;
        this.occupiedRooms = occupiedRooms;
        this.maintenanceRooms = maintenanceRooms;
        this.occupancyRate = totalRooms > 0 ? (double) occupiedRooms / totalRooms * 100 : 0;
        this.revenueToday = calculateRevenueToday();
    }

    private double calculateRevenueToday() {
        // Simple revenue calculation based on room types
        // This is a basic implementation - could be enhanced with actual pricing
        return occupiedRooms * 75.0; // Average price per night
    }

    // Getters and Setters
    public int getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(int totalRooms) {
        this.totalRooms = totalRooms;
    }

    public int getAvailableRooms() {
        return availableRooms;
    }

    public void setAvailableRooms(int availableRooms) {
        this.availableRooms = availableRooms;
    }

    public int getOccupiedRooms() {
        return occupiedRooms;
    }

    public void setOccupiedRooms(int occupiedRooms) {
        this.occupiedRooms = occupiedRooms;
    }

    public int getMaintenanceRooms() {
        return maintenanceRooms;
    }

    public void setMaintenanceRooms(int maintenanceRooms) {
        this.maintenanceRooms = maintenanceRooms;
    }

    public double getOccupancyRate() {
        return occupancyRate;
    }

    public void setOccupancyRate(double occupancyRate) {
        this.occupancyRate = occupancyRate;
    }

    public double getRevenueToday() {
        return revenueToday;
    }

    public void setRevenueToday(double revenueToday) {
        this.revenueToday = revenueToday;
    }
}