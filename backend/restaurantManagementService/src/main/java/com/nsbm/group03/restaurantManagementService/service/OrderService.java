package com.nsbm.group03.restaurantManagementService.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nsbm.group03.restaurantManagementService.dto.OrderDTO;
import com.nsbm.group03.restaurantManagementService.dto.OrderItemDTO;
import com.nsbm.group03.restaurantManagementService.entity.MenuItem;
import com.nsbm.group03.restaurantManagementService.entity.Order;
import com.nsbm.group03.restaurantManagementService.entity.OrderItem;
import com.nsbm.group03.restaurantManagementService.exception.ResourceNotFoundException;
import com.nsbm.group03.restaurantManagementService.repository.MenuItemRepository;
import com.nsbm.group03.restaurantManagementService.repository.OrderItemRepository;
import com.nsbm.group03.restaurantManagementService.repository.OrderRepository;

@Service
@Transactional
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    // DTO Converters
    private OrderItemDTO convertItemToDTO(OrderItem item) {
        return new OrderItemDTO(
                item.getId(),
                item.getOrderId(),
                item.getMenuItemId(),
                item.getMenuItemName(),
                item.getQuantity(),
                item.getUnitPrice(),
                item.getSubtotal(),
                item.getSpecialRequests()
        );
    }

    private OrderDTO convertToDTO(Order order) {
        List<OrderItemDTO> items = orderItemRepository.findByOrderId(order.getId())
                .stream()
                .map(this::convertItemToDTO)
                .collect(Collectors.toList());

        return new OrderDTO(
                order.getId(),
                order.getOrderNumber(),
                order.getTableId(),
                order.getCustomerName(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getOrderTime(),
                order.getUpdatedAt(),
                order.getSpecialInstructions(),
                order.getNumberOfGuests(),
                items
        );
    }

    // Generate order number
    private String generateOrderNumber() {
        long count = orderRepository.count() + 1;
        return String.format("RO-%04d", count);
    }

    // Create a new order
    public OrderDTO createOrder(OrderDTO orderDTO) {
        logger.info("Creating new order for table: {}", orderDTO.getTableId());

        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setTableId(orderDTO.getTableId());
        order.setCustomerName(orderDTO.getCustomerName());
        order.setStatus("PENDING");
        order.setOrderTime(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        order.setSpecialInstructions(orderDTO.getSpecialInstructions());
        order.setNumberOfGuests(orderDTO.getNumberOfGuests());
        order.setTotalAmount(0.0);

        Order savedOrder = orderRepository.save(order);

        // Process order items
        double total = 0.0;
        if (orderDTO.getOrderItems() != null && !orderDTO.getOrderItems().isEmpty()) {
            for (OrderItemDTO itemDTO : orderDTO.getOrderItems()) {
                MenuItem menuItem = menuItemRepository.findById(itemDTO.getMenuItemId())
                        .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", itemDTO.getMenuItemId()));

                OrderItem orderItem = new OrderItem(
                        savedOrder.getId(),
                        menuItem.getId(),
                        menuItem.getName(),
                        itemDTO.getQuantity(),
                        menuItem.getPrice(),
                        itemDTO.getSpecialRequests()
                );
                orderItemRepository.save(orderItem);
                total += orderItem.getSubtotal();
            }
        }

        savedOrder.setTotalAmount(total);
        orderRepository.save(savedOrder);

        logger.info("Successfully created order: {}", savedOrder.getOrderNumber());
        return convertToDTO(savedOrder);
    }

    // Get all orders
    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrders() {
        logger.info("Fetching all orders");
        return orderRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get order by ID
    @Transactional(readOnly = true)
    public Optional<OrderDTO> getOrderById(Long id) {
        logger.info("Fetching order with id: {}", id);
        return orderRepository.findById(id).map(this::convertToDTO);
    }

    // Get order by order number
    @Transactional(readOnly = true)
    public Optional<OrderDTO> getOrderByNumber(String orderNumber) {
        logger.info("Fetching order with number: {}", orderNumber);
        return orderRepository.findByOrderNumber(orderNumber).map(this::convertToDTO);
    }

    // Get orders by status
    @Transactional(readOnly = true)
    public List<OrderDTO> getOrdersByStatus(String status) {
        logger.info("Fetching orders with status: {}", status);
        return orderRepository.findByStatus(status.toUpperCase())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get orders by table
    @Transactional(readOnly = true)
    public List<OrderDTO> getOrdersByTable(Long tableId) {
        logger.info("Fetching orders for table: {}", tableId);
        return orderRepository.findByTableId(tableId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Search orders by customer name
    @Transactional(readOnly = true)
    public List<OrderDTO> searchOrdersByCustomer(String customerName) {
        logger.info("Searching orders by customer: {}", customerName);
        return orderRepository.findByCustomerNameContainingIgnoreCase(customerName)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Update order status
    public OrderDTO updateOrderStatus(Long id, String status) {
        logger.info("Updating status for order id: {} to: {}", id, status);
        Order existing = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        existing.setStatus(status.toUpperCase());
        existing.setUpdatedAt(LocalDateTime.now());
        return convertToDTO(orderRepository.save(existing));
    }

    // Update full order
    public OrderDTO updateOrder(Long id, OrderDTO orderDTO) {
        logger.info("Updating order with id: {}", id);
        Order existing = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        existing.setCustomerName(orderDTO.getCustomerName());
        existing.setSpecialInstructions(orderDTO.getSpecialInstructions());
        existing.setNumberOfGuests(orderDTO.getNumberOfGuests());
        existing.setUpdatedAt(LocalDateTime.now());

        if (orderDTO.getStatus() != null) {
            existing.setStatus(orderDTO.getStatus().toUpperCase());
        }

        // Update order items if provided
        if (orderDTO.getOrderItems() != null && !orderDTO.getOrderItems().isEmpty()) {
            orderItemRepository.deleteByOrderId(id);
            double total = 0.0;
            for (OrderItemDTO itemDTO : orderDTO.getOrderItems()) {
                MenuItem menuItem = menuItemRepository.findById(itemDTO.getMenuItemId())
                        .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", itemDTO.getMenuItemId()));
                OrderItem orderItem = new OrderItem(
                        id,
                        menuItem.getId(),
                        menuItem.getName(),
                        itemDTO.getQuantity(),
                        menuItem.getPrice(),
                        itemDTO.getSpecialRequests()
                );
                orderItemRepository.save(orderItem);
                total += orderItem.getSubtotal();
            }
            existing.setTotalAmount(total);
        }

        Order updated = orderRepository.save(existing);
        logger.info("Successfully updated order with id: {}", updated.getId());
        return convertToDTO(updated);
    }

    // Delete order
    public void deleteOrder(Long id) {
        logger.info("Deleting order with id: {}", id);
        if (!orderRepository.existsById(id)) {
            throw new ResourceNotFoundException("Order", "id", id);
        }
        orderItemRepository.deleteByOrderId(id);
        orderRepository.deleteById(id);
        logger.info("Successfully deleted order with id: {}", id);
    }

    // Statistics
    @Transactional(readOnly = true)
    public long countOrders() {
        return orderRepository.count();
    }

    @Transactional(readOnly = true)
    public long countOrdersByStatus(String status) {
        return orderRepository.findByStatus(status).size();
    }

    @Transactional(readOnly = true)
    public double calculateTotalRevenue() {
        Double revenue = orderRepository.calculateTotalRevenue();
        return revenue != null ? revenue : 0.0;
    }
}
