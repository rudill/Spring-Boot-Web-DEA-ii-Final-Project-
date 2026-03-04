package com.nsbm.group03.inventoryManagementService.controller;

import com.nsbm.group03.inventoryManagementService.dto.InventoryItemDTO;
import com.nsbm.group03.inventoryManagementService.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
class InventoryController {
    @Autowired
    private InventoryService inventoryService;

    // Get all inventory items
    @GetMapping
    public List<InventoryItemDTO> getInventory() {
        return inventoryService.getAllItem();
    }

    // Create new inventory item
    @PostMapping
    public InventoryItemDTO createItem(@RequestBody InventoryItemDTO item) {
        return inventoryService.addItem(item);
    }

    // Update inventory item
    @PutMapping("/{id}/consume")
    public InventoryItemDTO consumeItem(@PathVariable Long id, @RequestParam int amountUsed) {
        return inventoryService.updateStock(id, amountUsed);
    }

    // Get inventory item by id
    @GetMapping("/{id}")
    public InventoryItemDTO getItemById(@PathVariable Long id) {
        return inventoryService.getItemById(id);
    }

    // Update inventory item
    @PutMapping("/{id}")
    public InventoryItemDTO updateItem(@PathVariable Long id, @RequestBody InventoryItemDTO item) {
        return inventoryService.updateItem(id, item);
    }

    // Delete inventory item
    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {
        inventoryService.deleteItem(id);
    }

    // Restock inventory item
    @PutMapping("/{id}/restock")
    public InventoryItemDTO restockItem(@PathVariable Long id, @RequestParam int amount) {
        return inventoryService.restockItem(id, amount);
    }

    // Get low stock inventory items
    @GetMapping("/low-stock")
    public List<InventoryItemDTO> getLowStockItems() {
        return inventoryService.getLowStockItems();
    }

    // Search inventory items
    @GetMapping("/search")
    public List<InventoryItemDTO> searchItems(@RequestParam String keyword) {
        return inventoryService.searchItems(keyword);
    }

}
