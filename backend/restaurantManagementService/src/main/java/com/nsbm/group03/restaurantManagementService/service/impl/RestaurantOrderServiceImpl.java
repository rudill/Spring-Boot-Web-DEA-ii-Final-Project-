package com.nsbm.group03.restaurantManagementService.service.impl;

import com.nsbm.group03.restaurantManagementService.dto.RestaurantOrderDTO;
import com.nsbm.group03.restaurantManagementService.entity.RestaurantOrder;
import com.nsbm.group03.restaurantManagementService.enums.OrderStatus;
import com.nsbm.group03.restaurantManagementService.exception.ResourceNotFoundException;
import com.nsbm.group03.restaurantManagementService.repository.RestaurantOrderRepository;
import com.nsbm.group03.restaurantManagementService.service.RestaurantOrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RestaurantOrderServiceImpl implements RestaurantOrderService {

    private static final Logger logger = LoggerFactory.getLogger(RestaurantOrderServiceImpl.class);

    private final RestaurantOrderRepository orderRepository;

    public RestaurantOrderServiceImpl(RestaurantOrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    @Transactional
    public RestaurantOrderDTO createOrder(RestaurantOrderDTO dto) {
        RestaurantOrder order = new RestaurantOrder();
        order.setTableId(dto.getTableId());
        order.setTotalAmount(dto.getTotalAmount() != null ? dto.getTotalAmount() : 0.0);
        order.setSpecialNotes(dto.getSpecialNotes());
        order.setOrderStatus(OrderStatus.PENDING);

        RestaurantOrder saved = orderRepository.save(order);
        logger.info("Created restaurant order ID: {} for table ID: {}", saved.getId(), saved.getTableId());
        return mapToDTO(saved);
    }

    @Override
    public RestaurantOrderDTO getOrderById(Long id) {
        RestaurantOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant Order", id));
        return mapToDTO(order);
    }

    @Override
    public List<RestaurantOrderDTO> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RestaurantOrderDTO> getOrdersByStatus(String status) {
        OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
        return orderRepository.findByOrderStatus(orderStatus)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RestaurantOrderDTO> getActiveOrders() {
        return orderRepository.findByOrderStatusNot(OrderStatus.SERVED)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RestaurantOrderDTO> getOrdersByTable(Long tableId) {
        return orderRepository.findByTableId(tableId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public RestaurantOrderDTO updateOrderStatus(Long id, String status) {
        RestaurantOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant Order", id));

        OrderStatus newStatus = OrderStatus.valueOf(status.toUpperCase());
        order.setOrderStatus(newStatus);
        RestaurantOrder updated = orderRepository.save(order);
        logger.info("Order ID {} status changed to {}", id, newStatus);
        return mapToDTO(updated);
    }

    @Override
    @Transactional
    public RestaurantOrderDTO updateOrder(Long id, RestaurantOrderDTO dto) {
        RestaurantOrder existing = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant Order", id));

        if (dto.getTableId() != null) {
            existing.setTableId(dto.getTableId());
        }
        if (dto.getTotalAmount() != null) {
            existing.setTotalAmount(dto.getTotalAmount());
        }
        if (dto.getSpecialNotes() != null) {
            existing.setSpecialNotes(dto.getSpecialNotes());
        }

        RestaurantOrder updated = orderRepository.save(existing);
        logger.info("Updated restaurant order ID: {}", updated.getId());
        return mapToDTO(updated);
    }

    @Override
    public void deleteOrder(Long id) {
        RestaurantOrder existing = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant Order", id));
        orderRepository.delete(existing);
        logger.info("Deleted restaurant order with ID: {}", id);
    }

    @Override
    public Map<String, Long> getDashboardCounts() {
        Map<String, Long> counts = new LinkedHashMap<>();
        for (OrderStatus s : OrderStatus.values()) {
            counts.put(s.name(), orderRepository.countByOrderStatus(s));
        }
        return counts;
    }

    // ── DTO ↔ Entity Mapping ──

    private RestaurantOrderDTO mapToDTO(RestaurantOrder entity) {
        RestaurantOrderDTO dto = new RestaurantOrderDTO();
        dto.setId(entity.getId());
        dto.setTableId(entity.getTableId());
        dto.setOrderStatus(entity.getOrderStatus().name());
        dto.setTotalAmount(entity.getTotalAmount());
        dto.setSpecialNotes(entity.getSpecialNotes());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
}
