package com.nsbm.group03.kitchenManagementService.dto;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class KitchenOrderDTO {

    private Long id;

    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;

    private String tableNumber;

    private Long staffId; // from Employee Management Service

    private String orderStatus; // PENDING, COOKING, READY, SERVED

    @Size(max = 500, message = "Special instructions must not exceed 500 characters")
    private String specialInstructions;

    private Double totalAmount;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<KitchenOrderItemDTO> orderItems;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ── Constructors ──
    public KitchenOrderDTO() {
    }

    public KitchenOrderDTO(Long id, Long restaurantId, String tableNumber, Long staffId,
                           String orderStatus, String specialInstructions, Double totalAmount,
                           List<KitchenOrderItemDTO> orderItems, LocalDateTime createdAt,
                           LocalDateTime updatedAt) {
        this.id = id;
        this.restaurantId = restaurantId;
        this.tableNumber = tableNumber;
        this.staffId = staffId;
        this.orderStatus = orderStatus;
        this.specialInstructions = specialInstructions;
        this.totalAmount = totalAmount;
        this.orderItems = orderItems;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ── Getters and Setters ──
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }

    public String getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }

    public Long getStaffId() {
        return staffId;
    }

    public void setStaffId(Long staffId) {
        this.staffId = staffId;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public String getSpecialInstructions() {
        return specialInstructions;
    }

    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public List<KitchenOrderItemDTO> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<KitchenOrderItemDTO> orderItems) {
        this.orderItems = orderItems;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // ── toString ──
    @Override
    public String toString() {
        return "KitchenOrderDTO{" +
                "id=" + id +
                ", restaurantId=" + restaurantId +
                ", tableNumber='" + tableNumber + '\'' +
                ", staffId=" + staffId +
                ", orderStatus='" + orderStatus + '\'' +
                ", specialInstructions='" + specialInstructions + '\'' +
                ", totalAmount=" + totalAmount +
                ", orderItems=" + orderItems +
                '}';
    }
}
