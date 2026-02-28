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
public class OrderItemService {

    private static final Logger logger = LoggerFactory.getLogger(OrderItemService.class);

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    private OrderItemDTO convertToDTO(OrderItem item) {
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

    @Transactional(readOnly = true)
    public List<OrderItemDTO> getItemsByOrderId(Long orderId) {
        logger.info("Fetching order items for order id: {}", orderId);
        if (!orderRepository.existsById(orderId)) {
            throw new ResourceNotFoundException("Order", "id", orderId);
        }
        return orderItemRepository.findByOrderId(orderId)
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<OrderItemDTO> getOrderItemById(Long id) {
        logger.info("Fetching order item with id: {}", id);
        return orderItemRepository.findById(id).map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public List<OrderItemDTO> getItemsByMenuItemId(Long menuItemId) {
        logger.info("Fetching order items for menu item id: {}", menuItemId);
        return orderItemRepository.findByMenuItemId(menuItemId)
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public OrderItemDTO addOrderItem(OrderItemDTO orderItemDTO) {
        logger.info("Adding item to order id: {}", orderItemDTO.getOrderId());

        Order order = orderRepository.findById(orderItemDTO.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderItemDTO.getOrderId()));

        MenuItem menuItem = menuItemRepository.findById(orderItemDTO.getMenuItemId())
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", orderItemDTO.getMenuItemId()));

        OrderItem orderItem = new OrderItem(
                order.getId(),
                menuItem.getId(),
                menuItem.getName(),
                orderItemDTO.getQuantity(),
                menuItem.getPrice(),
                orderItemDTO.getSpecialRequests()
        );
        OrderItem saved = orderItemRepository.save(orderItem);

        // Recalculate order total
        double newTotal = orderItemRepository.findByOrderId(order.getId())
                .stream().mapToDouble(OrderItem::getSubtotal).sum();
        order.setTotalAmount(newTotal);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);

        logger.info("Successfully added order item with id: {}", saved.getId());
        return convertToDTO(saved);
    }

    public OrderItemDTO updateOrderItemQuantity(Long id, Integer quantity) {
        logger.info("Updating quantity for order item id: {} to: {}", id, quantity);
        if (quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }

        OrderItem existing = orderItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("OrderItem", "id", id));

        existing.setQuantity(quantity);
        existing.setSubtotal(existing.getUnitPrice() * quantity);
        OrderItem updated = orderItemRepository.save(existing);

        // Recalculate order total
        Order order = orderRepository.findById(existing.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", existing.getOrderId()));
        double newTotal = orderItemRepository.findByOrderId(order.getId())
                .stream().mapToDouble(OrderItem::getSubtotal).sum();
        order.setTotalAmount(newTotal);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);

        logger.info("Successfully updated order item quantity for id: {}", updated.getId());
        return convertToDTO(updated);
    }

    public void deleteOrderItem(Long id) {
        logger.info("Deleting order item with id: {}", id);
        OrderItem existing = orderItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("OrderItem", "id", id));

        Long orderId = existing.getOrderId();
        orderItemRepository.deleteById(id);

        // Recalculate order total
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        double newTotal = orderItemRepository.findByOrderId(orderId)
                .stream().mapToDouble(OrderItem::getSubtotal).sum();
        order.setTotalAmount(newTotal);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);

        logger.info("Successfully deleted order item with id: {}", id);
    }
}
