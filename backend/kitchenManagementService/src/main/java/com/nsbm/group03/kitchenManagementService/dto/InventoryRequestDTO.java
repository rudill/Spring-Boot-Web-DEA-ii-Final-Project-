package com.nsbm.group03.kitchenManagementService.dto;

/**
 * DTO for sending inventory consumption requests to the Inventory Management Service.
 * Used when a kitchen order is created and ingredients need to be deducted.
 */
public class InventoryRequestDTO {

    private String itemName;
    private int quantity;

    // ── Constructors ──
    public InventoryRequestDTO() {
    }

    public InventoryRequestDTO(String itemName, int quantity) {
        this.itemName = itemName;
        this.quantity = quantity;
    }

    // ── Getters and Setters ──
    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    // ── toString ──
    @Override
    public String toString() {
        return "InventoryRequestDTO{" +
                "itemName='" + itemName + '\'' +
                ", quantity=" + quantity +
                '}';
    }
}
