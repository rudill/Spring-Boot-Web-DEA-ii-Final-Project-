package com.nsbm.group03.kitchenManagementService.dto;

/**
 * DTO for receiving inventory item data FROM the Inventory Management Service.
 * Mirrors the InventoryItem entity in the Inventory Service.
 */
public class InventoryItemDTO {

    private Long id;
    private String name;
    private String category;
    private int quantity;
    private int lowStock;

    // ── Constructors ──
    public InventoryItemDTO() {
    }

    public InventoryItemDTO(Long id, String name, String category, int quantity, int lowStock) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.quantity = quantity;
        this.lowStock = lowStock;
    }

    // ── Getters and Setters ──
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getLowStock() {
        return lowStock;
    }

    public void setLowStock(int lowStock) {
        this.lowStock = lowStock;
    }

    // ── toString ──
    @Override
    public String toString() {
        return "InventoryItemDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", category='" + category + '\'' +
                ", quantity=" + quantity +
                ", lowStock=" + lowStock +
                '}';
    }
}
