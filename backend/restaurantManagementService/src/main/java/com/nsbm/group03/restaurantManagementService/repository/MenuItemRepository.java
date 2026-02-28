package com.nsbm.group03.restaurantManagementService.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nsbm.group03.restaurantManagementService.entity.MenuItem;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    List<MenuItem> findByCategory(String category);

    List<MenuItem> findByIsAvailable(Boolean isAvailable);

    List<MenuItem> findByNameContainingIgnoreCase(String name);

    List<MenuItem> findByCategoryAndIsAvailable(String category, Boolean isAvailable);

    boolean existsByName(String name);
}
