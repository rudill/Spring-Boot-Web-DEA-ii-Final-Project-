package com.nsbm.group03.restaurantManagementService.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "restaurant_orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String orderNumber;

    @Column(nullable = false)
    @NotNull(message = "Table ID is required")
    private Long tableId;

    @Column
    private String customerName;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private Double totalAmount = 0.0;

    @Column(nullable = false)
    private LocalDateTime orderTime;

    @Column
    private LocalDateTime updatedAt;

    @Column(length = 500)
    private String specialInstructions;

    @Column
    private Integer numberOfGuests;

    public Order() {}

    public Order(String orderNumber, Long tableId, String customerName, String status,
                 Double totalAmount, LocalDateTime orderTime, String specialInstructions, Integer numberOfGuests) {
        this.orderNumber = orderNumber;
        this.tableId = tableId;
        this.customerName = customerName;
        this.status = status;
        this.totalAmount = totalAmount;
        this.orderTime = orderTime;
        this.updatedAt = orderTime;
        this.specialInstructions = specialInstructions;
        this.numberOfGuests = numberOfGuests;
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
}
