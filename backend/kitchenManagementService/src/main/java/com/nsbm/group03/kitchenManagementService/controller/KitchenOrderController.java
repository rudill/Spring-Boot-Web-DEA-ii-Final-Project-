package com.nsbm.group03.kitchenManagementService.controller;

import java.util.List;
import java.util.Map;

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
import org.springframework.web.bind.annotation.RestController;

import com.nsbm.group03.kitchenManagementService.dto.InventoryItemDTO;
import com.nsbm.group03.kitchenManagementService.dto.KitchenOrderDTO;
import com.nsbm.group03.kitchenManagementService.response.ApiResponse;
import com.nsbm.group03.kitchenManagementService.service.KitchenOrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/kitchen/orders")

@Validated
public class KitchenOrderController {

    private final KitchenOrderService orderService;

    public KitchenOrderController(KitchenOrderService orderService) {
        this.orderService = orderService;
    }

    // ══════════════════════════════════════
    //  CRUD Endpoints
    // ══════════════════════════════════════

    /**
     * POST /api/kitchen/orders — Create a new kitchen order
     * Validates menu item availability before creating.
     * Sends inventory deduction request to Inventory Service.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<KitchenOrderDTO>> createOrder(
            @Valid @RequestBody KitchenOrderDTO orderDTO) {
        KitchenOrderDTO created = orderService.createOrder(orderDTO);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Kitchen order created successfully", created),
                HttpStatus.CREATED);
    }

    /**
     * GET /api/kitchen/orders — Get all orders
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<KitchenOrderDTO>>> getAllOrders() {
        List<KitchenOrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Orders retrieved successfully", orders));
    }

    /**
     * GET /api/kitchen/orders/{id} — Get a single order by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<KitchenOrderDTO>> getOrderById(@PathVariable Long id) {
        KitchenOrderDTO order = orderService.getOrderById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Order retrieved successfully", order));
    }

    /**
     * PUT /api/kitchen/orders/{id} — Update an existing order
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<KitchenOrderDTO>> updateOrder(
            @PathVariable Long id,
            @Valid @RequestBody KitchenOrderDTO orderDTO) {
        KitchenOrderDTO updated = orderService.updateOrder(id, orderDTO);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Order updated successfully", updated));
    }

    /**
     * DELETE /api/kitchen/orders/{id} — Delete an order
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Order deleted successfully", null));
    }

    // ══════════════════════════════════════
    //  Status Management
    //  Flow: PENDING → COOKING → READY → SERVED
    // ══════════════════════════════════════

    /**
     * PATCH /api/kitchen/orders/{id}/status — Update order status
     * Request body: { "status": "COOKING" }
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<KitchenOrderDTO>> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        if (status == null || status.isBlank()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(false, "Status is required", null),
                    HttpStatus.BAD_REQUEST);
        }
        KitchenOrderDTO updated = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Order status updated to " + status.toUpperCase(), updated));
    }

    // ══════════════════════════════════════
    //  Filtering Endpoints
    // ══════════════════════════════════════

    /**
     * GET /api/kitchen/orders/status/{status} — Filter by status (PENDING, COOKING, READY, SERVED)
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<KitchenOrderDTO>>> getOrdersByStatus(
            @PathVariable String status) {
        List<KitchenOrderDTO> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Orders retrieved for status: " + status, orders));
    }

    /**
     * GET /api/kitchen/orders/staff/{staffId} — Filter by assigned kitchen staff
     */
    @GetMapping("/staff/{staffId}")
    public ResponseEntity<ApiResponse<List<KitchenOrderDTO>>> getOrdersByStaff(
            @PathVariable Long staffId) {
        List<KitchenOrderDTO> orders = orderService.getOrdersByStaff(staffId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Orders retrieved for staff: " + staffId, orders));
    }

    /**
     * GET /api/kitchen/orders/restaurant/{restaurantId} — Filter by restaurant
     */
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<ApiResponse<List<KitchenOrderDTO>>> getOrdersByRestaurant(
            @PathVariable Long restaurantId) {
        List<KitchenOrderDTO> orders = orderService.getOrdersByRestaurant(restaurantId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Orders retrieved for restaurant: " + restaurantId, orders));
    }

    // ══════════════════════════════════════
    //  Staff Assignment
    // ══════════════════════════════════════

    /**
     * PATCH /api/kitchen/orders/{id}/assign-staff — Assign kitchen staff to an order
     * Request body: { "staffId": 5 }
     */
    @PatchMapping("/{id}/assign-staff")
    public ResponseEntity<ApiResponse<KitchenOrderDTO>> assignStaff(
            @PathVariable Long id,
            @RequestBody Map<String, Long> request) {
        Long staffId = request.get("staffId");
        if (staffId == null) {
            return new ResponseEntity<>(
                    new ApiResponse<>(false, "staffId is required", null),
                    HttpStatus.BAD_REQUEST);
        }
        KitchenOrderDTO updated = orderService.assignStaff(id, staffId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Staff assigned successfully", updated));
    }

    // ══════════════════════════════════════
    //  Dashboard
    // ══════════════════════════════════════

    /**
     * GET /api/kitchen/orders/dashboard/counts — Get all order counts grouped by status
     */
    @GetMapping("/dashboard/counts")
    public ResponseEntity<ApiResponse<java.util.Map<String, Long>>> getDashboardCounts() {
        java.util.Map<String, Long> counts = orderService.getDashboardCounts();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Dashboard counts retrieved", counts));
    }

    /**
     * GET /api/kitchen/orders/count/{status} — Count orders by status (for dashboard)
     */
    @GetMapping("/count/{status}")
    public ResponseEntity<ApiResponse<Long>> countOrdersByStatus(@PathVariable String status) {
        long count = orderService.countOrdersByStatus(status);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Order count for status " + status, count));
    }

    // ══════════════════════════════════════
    //  Inventory Integration (read-only from Inventory Service)
    // ══════════════════════════════════════

    /**
     * GET /api/kitchen/orders/inventory — Get all inventory items from Inventory Service
     */
    @GetMapping("/inventory")
    public ResponseEntity<ApiResponse<List<InventoryItemDTO>>> getInventoryItems() {
        List<InventoryItemDTO> items = orderService.getInventoryItems();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Inventory items retrieved", items));
    }

    /**
     * GET /api/kitchen/orders/inventory/{itemId} — Get specific inventory item
     */
    @GetMapping("/inventory/{itemId}")
    public ResponseEntity<ApiResponse<InventoryItemDTO>> getInventoryItemById(@PathVariable Long itemId) {
        InventoryItemDTO item = orderService.getInventoryItemById(itemId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Inventory item retrieved", item));
    }
}
