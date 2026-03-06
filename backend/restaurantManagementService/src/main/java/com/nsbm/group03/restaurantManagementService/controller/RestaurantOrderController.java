package com.nsbm.group03.restaurantManagementService.controller;

import com.nsbm.group03.restaurantManagementService.dto.RestaurantOrderDTO;
import com.nsbm.group03.restaurantManagementService.response.ApiResponse;
import com.nsbm.group03.restaurantManagementService.service.RestaurantOrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/restaurant/orders")
@CrossOrigin
public class RestaurantOrderController {

    private final RestaurantOrderService orderService;

    public RestaurantOrderController(RestaurantOrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RestaurantOrderDTO>> createOrder(@RequestBody RestaurantOrderDTO dto) {
        RestaurantOrderDTO created = orderService.createOrder(dto);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Order created successfully", created),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RestaurantOrderDTO>>> getAllOrders() {
        List<RestaurantOrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "All orders retrieved", orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RestaurantOrderDTO>> getOrderById(@PathVariable Long id) {
        RestaurantOrderDTO order = orderService.getOrderById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Order retrieved", order));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<RestaurantOrderDTO>>> getActiveOrders() {
        List<RestaurantOrderDTO> orders = orderService.getActiveOrders();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Active orders retrieved", orders));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<RestaurantOrderDTO>>> getOrdersByStatus(
            @PathVariable String status) {
        List<RestaurantOrderDTO> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Orders retrieved for status: " + status, orders));
    }

    @GetMapping("/table/{tableId}")
    public ResponseEntity<ApiResponse<List<RestaurantOrderDTO>>> getOrdersByTable(
            @PathVariable Long tableId) {
        List<RestaurantOrderDTO> orders = orderService.getOrdersByTable(tableId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Orders retrieved for table: " + tableId, orders));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<RestaurantOrderDTO>> updateOrderStatus(
            @PathVariable Long id, @RequestBody Map<String, String> request) {
        String status = request.get("status");
        if (status == null || status.isBlank()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(false, "Status is required", null),
                    HttpStatus.BAD_REQUEST);
        }
        RestaurantOrderDTO updated = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Order status updated to " + status.toUpperCase(), updated));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RestaurantOrderDTO>> updateOrder(
            @PathVariable Long id, @RequestBody RestaurantOrderDTO dto) {
        RestaurantOrderDTO updated = orderService.updateOrder(id, dto);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Order updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Order deleted successfully", null));
    }

    @GetMapping("/dashboard/counts")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getDashboardCounts() {
        Map<String, Long> counts = orderService.getDashboardCounts();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Dashboard counts retrieved", counts));
    }
}
