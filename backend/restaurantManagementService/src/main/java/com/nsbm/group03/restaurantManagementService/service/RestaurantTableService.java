package com.nsbm.group03.restaurantManagementService.service;

import com.nsbm.group03.restaurantManagementService.dto.RestaurantTableDTO;

import java.util.List;

public interface RestaurantTableService {

    RestaurantTableDTO addTable(RestaurantTableDTO dto);

    RestaurantTableDTO getTableById(Long id);

    List<RestaurantTableDTO> getAllTables();

    List<RestaurantTableDTO> getAvailableTables();

    List<RestaurantTableDTO> getTablesByStatus(String status);

    RestaurantTableDTO updateTable(Long id, RestaurantTableDTO dto);

    RestaurantTableDTO occupyTable(Long id);

    RestaurantTableDTO freeTable(Long id);

    void deleteTable(Long id);
}
