package com.nsbm.group03.kitchenManagementService.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class KitchenMenuItemDTO {

    private Long id;

    @NotBlank(message = "Item name is required")
    @Size(min = 2, max = 100, message = "Item name must be between 2 and 100 characters")
    private String itemName;

    @NotBlank(message = "Category is required")
    @Size(min = 2, max = 50, message = "Category must be between 2 and 50 characters")
    private String category;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private Double price;

    private boolean available;

    @NotBlank(message = "Meal type is required")
    private String mealType; // BREAKFAST, LUNCH, DINNER, BUFFET

    @NotBlank(message = "Service type is required")
    private String serviceType; // RESTAURANT, EVENT

    @NotNull(message = "Menu date is required")
    private LocalDate menuDate;

    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ── Constructors ──
    public KitchenMenuItemDTO() {
    }

    public KitchenMenuItemDTO(Long id, String itemName, String category, Double price,
                              boolean available, String mealType, String serviceType,
                              LocalDate menuDate, Long restaurantId, String description,
                              LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.itemName = itemName;
        this.category = category;
        this.price = price;
        this.available = available;
        this.mealType = mealType;
        this.serviceType = serviceType;
        this.menuDate = menuDate;
        this.restaurantId = restaurantId;
        this.description = description;
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

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public String getMealType() {
        return mealType;
    }

    public void setMealType(String mealType) {
        this.mealType = mealType;
    }

    public String getServiceType() {
        return serviceType;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public LocalDate getMenuDate() {
        return menuDate;
    }

    public void setMenuDate(LocalDate menuDate) {
        this.menuDate = menuDate;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
        return "KitchenMenuItemDTO{" +
                "id=" + id +
                ", itemName='" + itemName + '\'' +
                ", category='" + category + '\'' +
                ", price=" + price +
                ", available=" + available +
                ", mealType='" + mealType + '\'' +
                ", serviceType='" + serviceType + '\'' +
                ", menuDate=" + menuDate +
                ", restaurantId=" + restaurantId +
                ", description='" + description + '\'' +
                '}';
    }
}
