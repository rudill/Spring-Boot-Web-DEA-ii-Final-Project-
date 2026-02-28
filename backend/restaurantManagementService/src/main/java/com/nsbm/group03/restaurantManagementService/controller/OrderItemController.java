package com.nsbm.group03.restaurantManagementService.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nsbm.group03.restaurantManagementService.dto.OrderItemDTO;
import com.nsbm.group03.restaurantManagementService.response.ApiResponse;
import com.nsbm.group03.restaurantManagementService.service.OrderItemService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/order-items")
@CrossOrigin(origins = "*")
@Tag(name = "Order Item Management", description = "APIs for managing individual order items")
public class OrderItemController {

    private static final Logger logger = LoggerFactory.getLogger(OrderItemController.class);

    @Autowired
    private OrderItemService orderItemService;

    @Operation(summary = "Get items by order ID", description = "Retrieves all items belonging to a specific order")
    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<List<OrderItemDTO>>> getItemsByOrderId(@PathVariable Long orderId) {
        logger.info("REST request to get items for order id: {}", orderId);
        List<OrderItemDTO> items = orderItemService.getItemsByOrderId(orderId);
        return ResponseEntity.ok(ApiResponse.success("Order items retrieved successfully", items));
    }

    @Operation(summary = "Get order item by ID", description = "Retrieves a single order item by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderItemDTO>> getOrderItemById(@PathVariable Long id) {
        logger.info("REST request to get order item by id: {}", id);
        return orderItemService.getOrderItemById(id)
                .map(item -> ResponseEntity.ok(ApiResponse.success("Order item retrieved successfully", item)))
                .orElse(new ResponseEntity<>(ApiResponse.error("Order item not found with id: " + id), HttpStatus.NOT_FOUND));
    }

    @Operation(summary = "Add item to order", description = "Adds a new item to an existing order")
    @PostMapping
    public ResponseEntity<ApiResponse<OrderItemDTO>> addOrderItem(@Valid @RequestBody OrderItemDTO orderItemDTO) {
        logger.info("REST request to add item to order id: {}", orderItemDTO.getOrderId());
        OrderItemDTO created = orderItemService.addOrderItem(orderItemDTO);
        return new ResponseEntity<>(
                ApiResponse.success("Order item added successfully", created),
                HttpStatus.CREATED
        );
    }

    @Operation(summary = "Update order item quantity", description = "Updates the quantity of an existing order item")
    @PatchMapping("/{id}/quantity")
    public ResponseEntity<ApiResponse<OrderItemDTO>> updateQuantity(
            @PathVariable Long id, @RequestParam Integer quantity) {
        logger.info("REST request to update quantity for order item id: {} to: {}", id, quantity);
        OrderItemDTO updated = orderItemService.updateOrderItemQuantity(id, quantity);
        return ResponseEntity.ok(ApiResponse.success("Order item quantity updated successfully", updated));
    }

    @Operation(summary = "Delete order item", description = "Removes an item from an order")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOrderItem(@PathVariable Long id) {
        logger.info("REST request to delete order item with id: {}", id);
        orderItemService.deleteOrderItem(id);
        return ResponseEntity.ok(ApiResponse.success("Order item deleted successfully", null));
    }

    @Operation(summary = "Get items by menu item ID", description = "Retrieves all order items for a specific menu item")
    @GetMapping("/menu-item/{menuItemId}")
    public ResponseEntity<ApiResponse<List<OrderItemDTO>>> getItemsByMenuItemId(@PathVariable Long menuItemId) {
        logger.info("REST request to get order items for menu item id: {}", menuItemId);
        List<OrderItemDTO> items = orderItemService.getItemsByMenuItemId(menuItemId);
        return ResponseEntity.ok(ApiResponse.success("Order items retrieved successfully", items));
    }
}
