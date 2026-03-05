package com.nsbm.group03.restaurantManagementService.repository;

import com.nsbm.group03.restaurantManagementService.entity.RestaurantTable;
import com.nsbm.group03.restaurantManagementService.enums.TableStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {

    List<RestaurantTable> findByStatus(TableStatus status);

    List<RestaurantTable> findByCapacityGreaterThanEqual(int capacity);
}
