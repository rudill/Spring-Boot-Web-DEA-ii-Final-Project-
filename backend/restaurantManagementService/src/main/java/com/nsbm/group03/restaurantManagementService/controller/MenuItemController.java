package com.nsbm.group03.restaurantManagementService.controller;

import com.nsbm.group03.restaurantManagementService.dto.MenuItemDTO;
import com.nsbm.group03.restaurantManagementService.response.ApiResponse;
import com.nsbm.group03.restaurantManagementService.service.MenuItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu-items")
@CrossOrigin(origins = "*")
@Tag(name = "Menu Item Management", description = "APIs for managing restaurant menu items")
public class MenuItemController {

    private static final Logger logger = LoggerFactory.getLogger(MenuItemController.class);

    @Autowired
    private MenuItemService menuItemService;

    @Operation(summary = "Create a new menu item", description = "Adds a new item to the restaurant menu")
    @PostMapping
    public ResponseEntity<ApiResponse<MenuItemDTO>> createMenuItem(@Valid @RequestBody MenuItemDTO menuItemDTO) {
        logger.info("REST request to create menu item: {}", menuItemDTO.getName());
        MenuItemDTO created = menuItemService.createMenuItem(menuItemDTO);
        return new ResponseEntity<>(
                ApiResponse.success("Menu item created successfully", created),
                HttpStatus.CREATED
        );
    }

    @Operation(summary = "Get all menu items", description = "Retrieves all items on the menu")
    @GetMapping
    public ResponseEntity<ApiResponse<List<MenuItemDTO>>> getAllMenuItems() {
        logger.info("REST request to get all menu items");
        List<MenuItemDTO> items = menuItemService.getAllMenuItems();
        return ResponseEntity.ok(ApiResponse.success("Menu items retrieved successfully", items));
    }

    @Operation(summary = "Get menu item by ID", description = "Retrieves a menu item by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItemDTO>> getMenuItemById(@PathVariable Long id) {
        logger.info("REST request to get menu item by id: {}", id);
        return menuItemService.getMenuItemById(id)
                .map(item -> ResponseEntity.ok(ApiResponse.success("Menu item retrieved successfully", item)))
                .orElse(new ResponseEntity<>(ApiResponse.error("Menu item not found with id: " + id), HttpStatus.NOT_FOUND));
    }

    @Operation(summary = "Get menu items by category", description = "Retrieves all menu items in a specific category")
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<MenuItemDTO>>> getMenuItemsByCategory(@PathVariable String category) {
        logger.info("REST request to get menu items by category: {}", category);
        List<MenuItemDTO> items = menuItemService.getMenuItemsByCategory(category);
        return ResponseEntity.ok(ApiResponse.success("Menu items retrieved successfully", items));
    }

    @Operation(summary = "Get available menu items", description = "Retrieves all currently available menu items")
    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<MenuItemDTO>>> getAvailableMenuItems() {
        logger.info("REST request to get available menu items");
        List<MenuItemDTO> items = menuItemService.getAvailableMenuItems();
        return ResponseEntity.ok(ApiResponse.success("Available menu items retrieved successfully", items));
    }

    @Operation(summary = "Get available items by category", description = "Retrieves available menu items in a specific category")
    @GetMapping("/available/category/{category}")
    public ResponseEntity<ApiResponse<List<MenuItemDTO>>> getAvailableMenuItemsByCategory(@PathVariable String category) {
        logger.info("REST request to get available menu items by category: {}", category);
        List<MenuItemDTO> items = menuItemService.getAvailableMenuItemsByCategory(category);
        return ResponseEntity.ok(ApiResponse.success("Menu items retrieved successfully", items));
    }

    @Operation(summary = "Search menu items by name", description = "Search menu items by name keyword")
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<MenuItemDTO>>> searchMenuItems(@RequestParam String name) {
        logger.info("REST request to search menu items with name: {}", name);
        List<MenuItemDTO> items = menuItemService.searchMenuItemsByName(name);
        return ResponseEntity.ok(ApiResponse.success("Search results retrieved successfully", items));
    }

    @Operation(summary = "Update a menu item", description = "Updates an existing menu item")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItemDTO>> updateMenuItem(
            @PathVariable Long id, @Valid @RequestBody MenuItemDTO menuItemDTO) {
        logger.info("REST request to update menu item with id: {}", id);
        MenuItemDTO updated = menuItemService.updateMenuItem(id, menuItemDTO);
        return ResponseEntity.ok(ApiResponse.success("Menu item updated successfully", updated));
    }

    @Operation(summary = "Update menu item availability", description = "Toggles availability of a menu item")
    @PatchMapping("/{id}/availability")
    public ResponseEntity<ApiResponse<MenuItemDTO>> updateAvailability(
            @PathVariable Long id, @RequestParam Boolean isAvailable) {
        logger.info("REST request to update availability for menu item id: {} to: {}", id, isAvailable);
        MenuItemDTO updated = menuItemService.updateAvailability(id, isAvailable);
        return ResponseEntity.ok(ApiResponse.success("Menu item availability updated successfully", updated));
    }

    @Operation(summary = "Delete a menu item", description = "Deletes a menu item from the system")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(@PathVariable Long id) {
        logger.info("REST request to delete menu item with id: {}", id);
        menuItemService.deleteMenuItem(id);
        return ResponseEntity.ok(ApiResponse.success("Menu item deleted successfully", null));
    }
}
