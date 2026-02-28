package com.nsbm.group03.restaurantManagementService.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nsbm.group03.restaurantManagementService.dto.RestaurantTableDTO;
import com.nsbm.group03.restaurantManagementService.entity.RestaurantTable;
import com.nsbm.group03.restaurantManagementService.exception.DuplicateResourceException;
import com.nsbm.group03.restaurantManagementService.exception.ResourceNotFoundException;
import com.nsbm.group03.restaurantManagementService.repository.RestaurantTableRepository;

@Service
@Transactional
public class RestaurantTableService {

    private static final Logger logger = LoggerFactory.getLogger(RestaurantTableService.class);

    @Autowired
    private RestaurantTableRepository tableRepository;

    private RestaurantTableDTO convertToDTO(RestaurantTable table) {
        return new RestaurantTableDTO(
                table.getId(), table.getTableNumber(), table.getCapacity(),
                table.getStatus(), table.getLocation(), table.getDescription()
        );
    }

    private RestaurantTable convertToEntity(RestaurantTableDTO dto) {
        RestaurantTable table = new RestaurantTable();
        table.setId(dto.getId());
        table.setTableNumber(dto.getTableNumber());
        table.setCapacity(dto.getCapacity());
        table.setStatus(dto.getStatus() != null ? dto.getStatus() : "AVAILABLE");
        table.setLocation(dto.getLocation());
        table.setDescription(dto.getDescription());
        return table;
    }

    public RestaurantTableDTO createTable(RestaurantTableDTO tableDTO) {
        logger.info("Creating restaurant table number: {}", tableDTO.getTableNumber());
        if (tableRepository.existsByTableNumber(tableDTO.getTableNumber())) {
            throw new DuplicateResourceException("Table with number " + tableDTO.getTableNumber() + " already exists");
        }
        RestaurantTable saved = tableRepository.save(convertToEntity(tableDTO));
        logger.info("Successfully created table with id: {}", saved.getId());
        return convertToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<RestaurantTableDTO> getAllTables() {
        logger.info("Fetching all restaurant tables");
        return tableRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<RestaurantTableDTO> getTableById(Long id) {
        logger.info("Fetching table with id: {}", id);
        return tableRepository.findById(id).map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public Optional<RestaurantTableDTO> getTableByNumber(Integer tableNumber) {
        logger.info("Fetching table with number: {}", tableNumber);
        return tableRepository.findByTableNumber(tableNumber).map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public List<RestaurantTableDTO> getTablesByStatus(String status) {
        logger.info("Fetching tables with status: {}", status);
        return tableRepository.findByStatus(status.toUpperCase())
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RestaurantTableDTO> getTablesByLocation(String location) {
        logger.info("Fetching tables at location: {}", location);
        return tableRepository.findByLocation(location)
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RestaurantTableDTO> getTablesByMinCapacity(Integer capacity) {
        logger.info("Fetching tables with minimum capacity: {}", capacity);
        return tableRepository.findByCapacityGreaterThanEqual(capacity)
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public RestaurantTableDTO updateTable(Long id, RestaurantTableDTO tableDTO) {
        logger.info("Updating table with id: {}", id);
        RestaurantTable existing = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RestaurantTable", "id", id));
        if (!existing.getTableNumber().equals(tableDTO.getTableNumber())
                && tableRepository.existsByTableNumber(tableDTO.getTableNumber())) {
            throw new DuplicateResourceException("Table with number " + tableDTO.getTableNumber() + " already exists");
        }
        existing.setTableNumber(tableDTO.getTableNumber());
        existing.setCapacity(tableDTO.getCapacity());
        if (tableDTO.getStatus() != null) existing.setStatus(tableDTO.getStatus());
        existing.setLocation(tableDTO.getLocation());
        existing.setDescription(tableDTO.getDescription());
        RestaurantTable updated = tableRepository.save(existing);
        logger.info("Successfully updated table with id: {}", updated.getId());
        return convertToDTO(updated);
    }

    public RestaurantTableDTO updateTableStatus(Long id, String status) {
        logger.info("Updating status for table id: {} to: {}", id, status);
        RestaurantTable existing = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RestaurantTable", "id", id));
        existing.setStatus(status.toUpperCase());
        return convertToDTO(tableRepository.save(existing));
    }

    public void deleteTable(Long id) {
        logger.info("Deleting table with id: {}", id);
        if (!tableRepository.existsById(id)) {
            throw new ResourceNotFoundException("RestaurantTable", "id", id);
        }
        tableRepository.deleteById(id);
        logger.info("Successfully deleted table with id: {}", id);
    }

    @Transactional(readOnly = true)
    public long countTables() {
        return tableRepository.count();
    }

    @Transactional(readOnly = true)
    public long countAvailableTables() {
        return tableRepository.findByStatus("AVAILABLE").size();
    }

    @Transactional(readOnly = true)
    public long countOccupiedTables() {
        return tableRepository.findByStatus("OCCUPIED").size();
    }
}
