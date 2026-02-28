package com.nsbm.group03.restaurantManagementService.controller;

import com.nsbm.group03.restaurantManagementService.dto.OrderDTO;
import com.nsbm.group03.restaurantManagementService.dto.RestaurantStatisticsDTO;
import com.nsbm.group03.restaurantManagementService.response.ApiResponse;
import com.nsbm.group03.restaurantManagementService.service.MenuItemService;
import com.nsbm.group03.restaurantManagementService.service.OrderService;
import com.nsbm.group03.restaurantManagementService.service.RestaurantTableService;
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
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
@Tag(name = "Order Management", description = "APIs for managing restaurant orders")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    @Autowired
    private MenuItemService menuItemService;

    @Autowired
    private RestaurantTableService tableService;

    @Operation(summary = "Create a new order", description = "Places a new food order for a table")
    @PostMapping
    public ResponseEntity<ApiResponse<OrderDTO>> createOrder(@Valid @RequestBody OrderDTO orderDTO) {
        logger.info("REST request to create order for table: {}", orderDTO.getTableId());
        OrderDTO created = orderService.createOrder(orderDTO);
        return new ResponseEntity<>(
                ApiResponse.success("Order created successfully", created),
                HttpStatus.CREATED
        );
    }

    @Operation(summary = "Get all orders", description = "Retrieves all restaurant orders")
    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getAllOrders() {
        logger.info("REST request to get all orders");
        List<OrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", orders));
    }

    @Operation(summary = "Get order by ID", description = "Retrieves an order by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDTO>> getOrderById(@PathVariable Long id) {
        logger.info("REST request to get order by id: {}", id);
        return orderService.getOrderById(id)
                .map(order -> ResponseEntity.ok(ApiResponse.success("Order retrieved successfully", order)))
                .orElse(new ResponseEntity<>(ApiResponse.error("Order not found with id: " + id), HttpStatus.NOT_FOUND));
    }

    @Operation(summary = "Get order by order number", description = "Retrieves an order by its order number")
    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderDTO>> getOrderByNumber(@PathVariable String orderNumber) {
        logger.info("REST request to get order by number: {}", orderNumber);
        return orderService.getOrderByNumber(orderNumber)
                .map(order -> ResponseEntity.ok(ApiResponse.success("Order retrieved successfully", order)))
                .orElse(new ResponseEntity<>(ApiResponse.error("Order not found: " + orderNumber), HttpStatus.NOT_FOUND));
    }

    @Operation(summary = "Get orders by status", description = "Retrieves all orders with a specific status")
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getOrdersByStatus(@PathVariable String status) {
        logger.info("REST request to get orders with status: {}", status);
        List<OrderDTO> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", orders));
    }

    @Operation(summary = "Get orders by table", description = "Retrieves all orders for a specific table")
    @GetMapping("/table/{tableId}")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getOrdersByTable(@PathVariable Long tableId) {
        logger.info("REST request to get orders for table: {}", tableId);
        List<OrderDTO> orders = orderService.getOrdersByTable(tableId);
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", orders));
    }

    @Operation(summary = "Search orders by customer name", description = "Search orders by customer name")
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> searchOrdersByCustomer(@RequestParam String customerName) {
        logger.info("REST request to search orders by customer: {}", customerName);
        List<OrderDTO> orders = orderService.searchOrdersByCustomer(customerName);
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", orders));
    }

    @Operation(summary = "Update an order", description = "Updates an existing order")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDTO>> updateOrder(
            @PathVariable Long id, @Valid @RequestBody OrderDTO orderDTO) {
        logger.info("REST request to update order with id: {}", id);
        OrderDTO updated = orderService.updateOrder(id, orderDTO);
        return ResponseEntity.ok(ApiResponse.success("Order updated successfully", updated));
    }

    @Operation(summary = "Update order status", description = "Updates the status of an order (PENDING, CONFIRMED, PREPARING, READY, SERVED, CANCELLED)")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderDTO>> updateOrderStatus(
            @PathVariable Long id, @RequestParam String status) {
        logger.info("REST request to update status for order id: {} to: {}", id, status);
        OrderDTO updated = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Order status updated successfully", updated));
    }

    @Operation(summary = "Delete an order", description = "Cancels and removes an order")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOrder(@PathVariable Long id) {
        logger.info("REST request to delete order with id: {}", id);
        orderService.deleteOrder(id);
        return ResponseEntity.ok(ApiResponse.success("Order deleted successfully", null));
    }

    @Operation(summary = "Get restaurant statistics", description = "Retrieves overall restaurant statistics")
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<RestaurantStatisticsDTO>> getStatistics() {
        logger.info("REST request to get restaurant statistics");
        RestaurantStatisticsDTO stats = new RestaurantStatisticsDTO(
                menuItemService.countMenuItems(),
                menuItemService.countAvailableMenuItems(),
                tableService.countTables(),
                tableService.countAvailableTables(),
                tableService.countOccupiedTables(),
                orderService.countOrders(),
                orderService.countOrdersByStatus("PENDING"),
                orderService.countOrdersByStatus("PREPARING") + orderService.countOrdersByStatus("READY"),
                orderService.calculateTotalRevenue()
        );
        return ResponseEntity.ok(ApiResponse.success("Statistics retrieved successfully", stats));
    }
}
