package com.nsbm.group03.restaurantManagementService.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.nsbm.group03.restaurantManagementService.entity.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);

    List<OrderItem> findByMenuItemId(Long menuItemId);

    @Transactional
    void deleteByOrderId(Long orderId);
}
