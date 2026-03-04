package com.nsbm.group03.inventoryManagementService.repository;

import com.nsbm.group03.inventoryManagementService.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {
    List<InventoryItem> findByCategory(String category);

    List<InventoryItem> findByNameContainingIgnoreCase(String name);

    List<InventoryItem> findByCategoryContainingIgnoreCase(String category);

    @Query("SELECT i FROM InventoryItem i WHERE i.quantity <= CASE WHEN i.lowStock > 0 THEN i.lowStock ELSE 10 END")
    List<InventoryItem> findItemsAtOrBelowLowStock();
}
