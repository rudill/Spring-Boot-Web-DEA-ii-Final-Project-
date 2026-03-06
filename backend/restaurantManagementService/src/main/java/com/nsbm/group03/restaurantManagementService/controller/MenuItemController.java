package com.nsbm.group03.restaurantManagementService.controller;

import com.nsbm.group03.restaurantManagementService.dto.MenuItemDTO;
import com.nsbm.group03.restaurantManagementService.response.ApiResponse;
import com.nsbm.group03.restaurantManagementService.service.MenuItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurant/menu")
@CrossOrigin
public class MenuItemController {

    private final MenuItemService menuItemService;

    public MenuItemController(MenuItemService menuItemService) {
        this.menuItemService = menuItemService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MenuItemDTO>> addMenuItem(@RequestBody MenuItemDTO dto) {
        MenuItemDTO created = menuItemService.addMenuItem(dto);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Menu item added successfully", created),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MenuItemDTO>>> getAvailableMenu() {
        List<MenuItemDTO> menu = menuItemService.getAvailableMenuItems();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Available menu items retrieved", menu));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<MenuItemDTO>>> getAllMenuItems() {
        List<MenuItemDTO> menu = menuItemService.getAllMenuItems();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "All menu items retrieved", menu));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItemDTO>> getMenuItemById(@PathVariable Long id) {
        MenuItemDTO item = menuItemService.getMenuItemById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Menu item retrieved", item));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<MenuItemDTO>>> getMenuItemsByCategory(
            @PathVariable String category) {
        List<MenuItemDTO> items = menuItemService.getMenuItemsByCategory(category);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Menu items retrieved for category: " + category, items));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<MenuItemDTO>>> searchMenuItems(
            @RequestParam String name) {
        List<MenuItemDTO> items = menuItemService.searchMenuItemsByName(name);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Search results retrieved", items));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItemDTO>> updateMenuItem(
            @PathVariable Long id, @RequestBody MenuItemDTO dto) {
        MenuItemDTO updated = menuItemService.updateMenuItem(id, dto);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Menu item updated successfully", updated));
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<ApiResponse<MenuItemDTO>> toggleAvailability(@PathVariable Long id) {
        MenuItemDTO updated = menuItemService.toggleAvailability(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Menu item availability toggled", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(@PathVariable Long id) {
        menuItemService.deleteMenuItem(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Menu item deleted successfully", null));
    }
}
