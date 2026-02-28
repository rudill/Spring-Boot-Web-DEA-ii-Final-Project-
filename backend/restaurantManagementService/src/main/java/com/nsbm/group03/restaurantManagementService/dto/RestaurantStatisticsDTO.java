package com.nsbm.group03.restaurantManagementService.dto;

public class RestaurantStatisticsDTO {

    private long totalMenuItems;
    private long availableMenuItems;
    private long totalTables;
    private long availableTables;
    private long occupiedTables;
    private long totalOrders;
    private long pendingOrders;
    private long activeOrders;
    private double totalRevenue;

    public RestaurantStatisticsDTO() {}

    public RestaurantStatisticsDTO(long totalMenuItems, long availableMenuItems, long totalTables,
                                   long availableTables, long occupiedTables, long totalOrders,
                                   long pendingOrders, long activeOrders, double totalRevenue) {
        this.totalMenuItems = totalMenuItems;
        this.availableMenuItems = availableMenuItems;
        this.totalTables = totalTables;
        this.availableTables = availableTables;
        this.occupiedTables = occupiedTables;
        this.totalOrders = totalOrders;
        this.pendingOrders = pendingOrders;
        this.activeOrders = activeOrders;
        this.totalRevenue = totalRevenue;
    }

    public long getTotalMenuItems() { return totalMenuItems; }
    public void setTotalMenuItems(long totalMenuItems) { this.totalMenuItems = totalMenuItems; }

    public long getAvailableMenuItems() { return availableMenuItems; }
    public void setAvailableMenuItems(long availableMenuItems) { this.availableMenuItems = availableMenuItems; }

    public long getTotalTables() { return totalTables; }
    public void setTotalTables(long totalTables) { this.totalTables = totalTables; }

    public long getAvailableTables() { return availableTables; }
    public void setAvailableTables(long availableTables) { this.availableTables = availableTables; }

    public long getOccupiedTables() { return occupiedTables; }
    public void setOccupiedTables(long occupiedTables) { this.occupiedTables = occupiedTables; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; }

    public long getActiveOrders() { return activeOrders; }
    public void setActiveOrders(long activeOrders) { this.activeOrders = activeOrders; }

    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }
}
