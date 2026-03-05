package com.nsbm.group03.restaurantManagementService.service;

import com.nsbm.group03.restaurantManagementService.dto.RestaurantOrderDTO;

import java.util.List;
import java.util.Map;

public interface RestaurantOrderService {

    RestaurantOrderDTO createOrder(RestaurantOrderDTO dto);

    RestaurantOrderDTO getOrderById(Long id);

    List<RestaurantOrderDTO> getAllOrders();

    List<RestaurantOrderDTO> getOrdersByStatus(String status);

    List<RestaurantOrderDTO> getActiveOrders();

    List<RestaurantOrderDTO> getOrdersByTable(Long tableId);

    RestaurantOrderDTO updateOrderStatus(Long id, String status);

    RestaurantOrderDTO updateOrder(Long id, RestaurantOrderDTO dto);

    void deleteOrder(Long id);

    Map<String, Long> getDashboardCounts();
}
