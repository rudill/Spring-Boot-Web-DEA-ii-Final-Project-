package com.nsbm.group03.kitchenManagementService.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nsbm.group03.kitchenManagementService.dto.KitchenMenuItemDTO;
import com.nsbm.group03.kitchenManagementService.response.ApiResponse;
import com.nsbm.group03.kitchenManagementService.service.KitchenMenuItemService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/kitchen/menu")
@Validated
public class KitchenMenuItemController {

    private final KitchenMenuItemService menuItemService;

    public KitchenMenuItemController(KitchenMenuItemService menuItemService) {
        this.menuItemService = menuItemService;
    }

    // ══════════════════════════════════════
    //  CRUD Endpoints
    // ══════════════════════════════════════

    /**
     * POST /api/kitchen/menu — Create a new menu item
     */
    @PostMapping
    public ResponseEntity<ApiResponse<KitchenMenuItemDTO>> createMenuItem(
            @Valid @RequestBody KitchenMenuItemDTO menuItemDTO) {
        KitchenMenuItemDTO created = menuItemService.createMenuItem(menuItemDTO);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Menu item created successfully", created),
                HttpStatus.CREATED);
    }

    /**
     * GET /api/kitchen/menu — Get all menu items
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<KitchenMenuItemDTO>>> getAllMenuItems() {
        List<KitchenMenuItemDTO> items = menuItemService.getAllMenuItems();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Menu items retrieved successfully", items));
    }

    /**
     * GET /api/kitchen/menu/{id} — Get a single menu item by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<KitchenMenuItemDTO>> getMenuItemById(@PathVariable Long id) {
        KitchenMenuItemDTO item = menuItemService.getMenuItemById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Menu item retrieved successfully", item));
    }

    /**
     * PUT /api/kitchen/menu/{id} — Update a menu item
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<KitchenMenuItemDTO>> updateMenuItem(
            @PathVariable Long id,
            @Valid @RequestBody KitchenMenuItemDTO menuItemDTO) {
        KitchenMenuItemDTO updated = menuItemService.updateMenuItem(id, menuItemDTO);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Menu item updated successfully", updated));
    }

    /**
     * DELETE /api/kitchen/menu/{id} — Delete a menu item
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(@PathVariable Long id) {
        menuItemService.deleteMenuItem(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Menu item deleted successfully", null));
    }

    // ══════════════════════════════════════
    //  Filtering & Searching Endpoints
    // ══════════════════════════════════════

    /**
     * GET /api/kitchen/menu/restaurant/{restaurantId} — Filter by restaurant
     */
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<ApiResponse<List<KitchenMenuItemDTO>>> getByRestaurant(
            @PathVariable Long restaurantId) {
        List<KitchenMenuItemDTO> items = menuItemService.getMenuItemsByRestaurant(restaurantId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Menu items retrieved for restaurant " + restaurantId, items));
    }

    /**
     * GET /api/kitchen/menu/meal-type/{mealType} — Filter by meal type (BREAKFAST, LUNCH, DINNER, BUFFET)
     */
    @GetMapping("/meal-type/{mealType}")
    public ResponseEntity<ApiResponse<List<KitchenMenuItemDTO>>> getByMealType(
            @PathVariable String mealType) {
        List<KitchenMenuItemDTO> items = menuItemService.getMenuItemsByMealType(mealType);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Menu items retrieved for meal type: " + mealType, items));
    }

    /**
     * GET /api/kitchen/menu/service-type/{serviceType} — Filter by service type (RESTAURANT, EVENT)
     */
    @GetMapping("/service-type/{serviceType}")
    public ResponseEntity<ApiResponse<List<KitchenMenuItemDTO>>> getByServiceType(
            @PathVariable String serviceType) {
        List<KitchenMenuItemDTO> items = menuItemService.getMenuItemsByServiceType(serviceType);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Menu items retrieved for service type: " + serviceType, items));
    }

    /**
     * GET /api/kitchen/menu/date?date=2026-02-19 — Filter by date
     */
    @GetMapping("/date")
    public ResponseEntity<ApiResponse<List<KitchenMenuItemDTO>>> getByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<KitchenMenuItemDTO> items = menuItemService.getMenuItemsByDate(date);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Menu items retrieved for date: " + date, items));
    }

    /**
     * GET /api/kitchen/menu/search?name=chicken — Search by item name
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<KitchenMenuItemDTO>>> searchByName(
            @RequestParam String name) {
        List<KitchenMenuItemDTO> items = menuItemService.searchMenuItemsByName(name);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Search results for: " + name, items));
    }

    /**
     * GET /api/kitchen/menu/category/{category} — Filter by category
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<KitchenMenuItemDTO>>> getByCategory(
            @PathVariable String category) {
        List<KitchenMenuItemDTO> items = menuItemService.getMenuItemsByCategory(category);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Menu items retrieved for category: " + category, items));
    }

    /**
     * GET /api/kitchen/menu/price-range?min=100&max=500 — Filter by price range
     */
    @GetMapping("/price-range")
    public ResponseEntity<ApiResponse<List<KitchenMenuItemDTO>>> getByPriceRange(
            @RequestParam Double min,
            @RequestParam Double max) {
        List<KitchenMenuItemDTO> items = menuItemService.getMenuItemsByPriceRange(min, max);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Menu items in price range " + min + " - " + max, items));
    }

    /**
     * GET /api/kitchen/menu/available — Get only available menus
     */
    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<KitchenMenuItemDTO>>> getAvailableMenuItems() {
        List<KitchenMenuItemDTO> items = menuItemService.getAvailableMenuItems();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Available menu items retrieved", items));
    }

    /**
     * GET /api/kitchen/menu/available/count — Count available menus (dashboard)
     */
    @GetMapping("/available/count")
    public ResponseEntity<ApiResponse<Long>> countAvailableMenuItems() {
        long count = menuItemService.countAvailableMenuItems();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Available menu item count", count));
    }

    // ══════════════════════════════════════
    //  Service-Specific Menu Views
    //  (for Event / Restaurant microservices)
    // ══════════════════════════════════════

    /**
     * GET /api/kitchen/menu/event-menu — Event Management can request available event menus
     */
    @GetMapping("/event-menu")
    public ResponseEntity<ApiResponse<List<KitchenMenuItemDTO>>> getEventMenu() {
        List<KitchenMenuItemDTO> items = menuItemService.getEventMenuItems();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Available event menu items retrieved", items));
    }

    /**
     * GET /api/kitchen/menu/restaurant-menu/{restaurantId} —
     * Restaurant Management can request available restaurant menus
     */
    @GetMapping("/restaurant-menu/{restaurantId}")
    public ResponseEntity<ApiResponse<List<KitchenMenuItemDTO>>> getRestaurantMenu(
            @PathVariable Long restaurantId) {
        List<KitchenMenuItemDTO> items = menuItemService.getRestaurantMenuItems(restaurantId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Available restaurant menu items retrieved", items));
    }

    // ══════════════════════════════════════
    //  Combined Filters
    // ══════════════════════════════════════

    /**
     * GET /api/kitchen/menu/filter?restaurantId=1&date=2026-02-19
     */
    @GetMapping("/filter/restaurant-date")
    public ResponseEntity<ApiResponse<List<KitchenMenuItemDTO>>> getByRestaurantAndDate(
            @RequestParam Long restaurantId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<KitchenMenuItemDTO> items = menuItemService.getMenuItemsByRestaurantAndDate(restaurantId, date);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Filtered menu items retrieved", items));
    }

    /**
     * GET /api/kitchen/menu/filter/restaurant-meal?restaurantId=1&mealType=BREAKFAST
     */
    @GetMapping("/filter/restaurant-meal")
    public ResponseEntity<ApiResponse<List<KitchenMenuItemDTO>>> getByRestaurantAndMealType(
            @RequestParam Long restaurantId,
            @RequestParam String mealType) {
        List<KitchenMenuItemDTO> items = menuItemService.getMenuItemsByRestaurantAndMealType(restaurantId, mealType);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Filtered menu items retrieved", items));
    }

    /**
     * GET /api/kitchen/menu/filter/combined?mealType=DINNER&serviceType=RESTAURANT&date=2026-02-19
     */
    @GetMapping("/filter/combined")
    public ResponseEntity<ApiResponse<List<KitchenMenuItemDTO>>> getByFilters(
            @RequestParam String mealType,
            @RequestParam String serviceType,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<KitchenMenuItemDTO> items = menuItemService.getMenuItemsByFilters(mealType, serviceType, date);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Filtered menu items retrieved", items));
    }

    // ══════════════════════════════════════
    //  Availability Toggle
    // ══════════════════════════════════════

    /**
     * PATCH /api/kitchen/menu/{id}/toggle-availability — Toggle item availability
     */
    @PatchMapping("/{id}/toggle-availability")
    public ResponseEntity<ApiResponse<KitchenMenuItemDTO>> toggleAvailability(@PathVariable Long id) {
        KitchenMenuItemDTO updated = menuItemService.toggleAvailability(id);
        String status = updated.isAvailable() ? "available" : "unavailable";
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Menu item marked as " + status, updated));
    }
}
