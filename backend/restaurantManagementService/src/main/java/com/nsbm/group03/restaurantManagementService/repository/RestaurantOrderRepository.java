package com.nsbm.group03.restaurantManagementService.repository;

import com.nsbm.group03.restaurantManagementService.entity.RestaurantOrder;
import com.nsbm.group03.restaurantManagementService.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantOrderRepository extends JpaRepository<RestaurantOrder, Long> {

    List<RestaurantOrder> findByOrderStatus(OrderStatus orderStatus);

    List<RestaurantOrder> findByTableId(Long tableId);

    List<RestaurantOrder> findByOrderStatusNot(OrderStatus orderStatus);

    long countByOrderStatus(OrderStatus orderStatus);
}
