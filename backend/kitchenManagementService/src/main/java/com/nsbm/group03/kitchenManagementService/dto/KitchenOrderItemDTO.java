package com.nsbm.group03.kitchenManagementService.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class KitchenOrderItemDTO {

    private Long id;

    @NotNull(message = "Menu item ID is required")
    private Long menuItemId;

    private String itemName; // populated from menu item on server side

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private Double price; // populated from menu item on server side

    @Size(max = 300, message = "Notes must not exceed 300 characters")
    private String notes;

    // ── Constructors ──
    public KitchenOrderItemDTO() {
    }

    public KitchenOrderItemDTO(Long id, Long menuItemId, String itemName,
                               Integer quantity, Double price, String notes) {
        this.id = id;
        this.menuItemId = menuItemId;
        this.itemName = itemName;
        this.quantity = quantity;
        this.price = price;
        this.notes = notes;
    }

    // ── Getters and Setters ──
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMenuItemId() {
        return menuItemId;
    }

    public void setMenuItemId(Long menuItemId) {
        this.menuItemId = menuItemId;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    // ── toString ──
    @Override
    public String toString() {
        return "KitchenOrderItemDTO{" +
                "id=" + id +
                ", menuItemId=" + menuItemId +
                ", itemName='" + itemName + '\'' +
                ", quantity=" + quantity +
                ", price=" + price +
                ", notes='" + notes + '\'' +
                '}';
    }
}
