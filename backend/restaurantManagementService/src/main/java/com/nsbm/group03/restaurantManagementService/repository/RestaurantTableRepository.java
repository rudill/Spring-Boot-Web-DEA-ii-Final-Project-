package com.nsbm.group03.restaurantManagementService.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nsbm.group03.restaurantManagementService.entity.RestaurantTable;

@Repository
public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {

    Optional<RestaurantTable> findByTableNumber(Integer tableNumber);

    List<RestaurantTable> findByStatus(String status);

    List<RestaurantTable> findByLocation(String location);

    List<RestaurantTable> findByCapacityGreaterThanEqual(Integer capacity);

    boolean existsByTableNumber(Integer tableNumber);
}
