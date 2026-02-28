package com.nsbm.group03.restaurantManagementService.dto;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.constraints.NotNull;

public class OrderDTO {

    private Long id;
    private String orderNumber;

    @NotNull(message = "Table ID is required")
    private Long tableId;

    private String customerName;
    private String status;
    private Double totalAmount;
    private LocalDateTime orderTime;
    private LocalDateTime updatedAt;
    private String specialInstructions;
    private Integer numberOfGuests;
    private List<OrderItemDTO> orderItems;

    public OrderDTO() {}

    public OrderDTO(Long id, String orderNumber, Long tableId, String customerName,
                    String status, Double totalAmount, LocalDateTime orderTime,
                    LocalDateTime updatedAt, String specialInstructions,
                    Integer numberOfGuests, List<OrderItemDTO> orderItems) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.tableId = tableId;
        this.customerName = customerName;
        this.status = status;
        this.totalAmount = totalAmount;
        this.orderTime = orderTime;
        this.updatedAt = updatedAt;
        this.specialInstructions = specialInstructions;
        this.numberOfGuests = numberOfGuests;
        this.orderItems = orderItems;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public Long getTableId() { return tableId; }
    public void setTableId(Long tableId) { this.tableId = tableId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public LocalDateTime getOrderTime() { return orderTime; }
    public void setOrderTime(LocalDateTime orderTime) { this.orderTime = orderTime; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }

    public Integer getNumberOfGuests() { return numberOfGuests; }
    public void setNumberOfGuests(Integer numberOfGuests) { this.numberOfGuests = numberOfGuests; }

    public List<OrderItemDTO> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItemDTO> orderItems) { this.orderItems = orderItems; }
}
