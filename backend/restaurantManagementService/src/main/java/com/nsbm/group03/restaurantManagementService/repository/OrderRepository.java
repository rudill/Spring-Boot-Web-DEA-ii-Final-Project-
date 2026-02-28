package com.nsbm.group03.restaurantManagementService.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.nsbm.group03.restaurantManagementService.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    List<Order> findByStatus(String status);

    List<Order> findByTableId(Long tableId);

    List<Order> findByCustomerNameContainingIgnoreCase(String customerName);

    boolean existsByOrderNumber(String orderNumber);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'SERVED'")
    Double calculateTotalRevenue();
}
