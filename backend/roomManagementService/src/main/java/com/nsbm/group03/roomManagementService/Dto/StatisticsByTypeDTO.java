package com.nsbm.group03.roomManagementService.Dto;

import java.util.Map;

/**
 * DTO for statistics broken down by room type
 */
public class StatisticsByTypeDTO {

    private Map<String, TypeStatistics> statisticsByType;
    private int totalRooms;
    private int totalAvailable;
    private int totalOccupied;
    private int totalMaintenance;

    public StatisticsByTypeDTO() {}

    public StatisticsByTypeDTO(Map<String, TypeStatistics> statisticsByType) {
        this.statisticsByType = statisticsByType;
        calculateTotals();
    }

    private void calculateTotals() {
        this.totalRooms = statisticsByType.values().stream().mapToInt(TypeStatistics::getTotal).sum();
        this.totalAvailable = statisticsByType.values().stream().mapToInt(TypeStatistics::getAvailable).sum();
        this.totalOccupied = statisticsByType.values().stream().mapToInt(TypeStatistics::getOccupied).sum();
        this.totalMaintenance = statisticsByType.values().stream().mapToInt(TypeStatistics::getMaintenance).sum();
    }

    // Getters and Setters
    public Map<String, TypeStatistics> getStatisticsByType() {
        return statisticsByType;
    }

    public void setStatisticsByType(Map<String, TypeStatistics> statisticsByType) {
        this.statisticsByType = statisticsByType;
        calculateTotals();
    }

    public int getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(int totalRooms) {
        this.totalRooms = totalRooms;
    }

    public int getTotalAvailable() {
        return totalAvailable;
    }

    public void setTotalAvailable(int totalAvailable) {
        this.totalAvailable = totalAvailable;
    }

    public int getTotalOccupied() {
        return totalOccupied;
    }

    public void setTotalOccupied(int totalOccupied) {
        this.totalOccupied = totalOccupied;
    }

    public int getTotalMaintenance() {
        return totalMaintenance;
    }

    public void setTotalMaintenance(int totalMaintenance) {
        this.totalMaintenance = totalMaintenance;
    }

    /**
     * Inner class for statistics of a specific room type
     */
    public static class TypeStatistics {
        private String roomType;
        private int total;
        private int available;
        private int occupied;
        private int maintenance;
        private double occupancyRate;
        private double pricePerNight;

        public TypeStatistics() {}

        public TypeStatistics(String roomType, int total, int available, int occupied, int maintenance, double pricePerNight) {
            this.roomType = roomType;
            this.total = total;
            this.available = available;
            this.occupied = occupied;
            this.maintenance = maintenance;
            this.pricePerNight = pricePerNight;
            this.occupancyRate = total > 0 ? (double) occupied / total * 100 : 0;
        }

        // Getters and Setters
        public String getRoomType() {
            return roomType;
        }

        public void setRoomType(String roomType) {
            this.roomType = roomType;
        }

        public int getTotal() {
            return total;
        }

        public void setTotal(int total) {
            this.total = total;
        }

        public int getAvailable() {
            return available;
        }

        public void setAvailable(int available) {
            this.available = available;
        }

        public int getOccupied() {
            return occupied;
        }

        public void setOccupied(int occupied) {
            this.occupied = occupied;
        }

        public int getMaintenance() {
            return maintenance;
        }

        public void setMaintenance(int maintenance) {
            this.maintenance = maintenance;
        }

        public double getOccupancyRate() {
            return occupancyRate;
        }

        public void setOccupancyRate(double occupancyRate) {
            this.occupancyRate = occupancyRate;
        }

        public double getPricePerNight() {
            return pricePerNight;
        }

        public void setPricePerNight(double pricePerNight) {
            this.pricePerNight = pricePerNight;
        }
    }
}