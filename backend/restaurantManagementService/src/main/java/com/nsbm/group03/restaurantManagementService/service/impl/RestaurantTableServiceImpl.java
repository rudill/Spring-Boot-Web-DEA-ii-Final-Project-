package com.nsbm.group03.restaurantManagementService.service.impl;

import com.nsbm.group03.restaurantManagementService.dto.RestaurantTableDTO;
import com.nsbm.group03.restaurantManagementService.entity.RestaurantTable;
import com.nsbm.group03.restaurantManagementService.enums.TableStatus;
import com.nsbm.group03.restaurantManagementService.exception.ResourceNotFoundException;
import com.nsbm.group03.restaurantManagementService.repository.RestaurantTableRepository;
import com.nsbm.group03.restaurantManagementService.service.RestaurantTableService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantTableServiceImpl implements RestaurantTableService {

    private static final Logger logger = LoggerFactory.getLogger(RestaurantTableServiceImpl.class);

    private final RestaurantTableRepository tableRepository;

    public RestaurantTableServiceImpl(RestaurantTableRepository tableRepository) {
        this.tableRepository = tableRepository;
    }

    @Override
    public RestaurantTableDTO addTable(RestaurantTableDTO dto) {
        RestaurantTable entity = mapToEntity(dto);
        RestaurantTable saved = tableRepository.save(entity);
        logger.info("Added restaurant table #{} (ID: {})", saved.getTableNumber(), saved.getId());
        return mapToDTO(saved);
    }

    @Override
    public RestaurantTableDTO getTableById(Long id) {
        RestaurantTable entity = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant Table", id));
        return mapToDTO(entity);
    }

    @Override
    public List<RestaurantTableDTO> getAllTables() {
        return tableRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RestaurantTableDTO> getAvailableTables() {
        return tableRepository.findByStatus(TableStatus.AVAILABLE)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RestaurantTableDTO> getTablesByStatus(String status) {
        TableStatus tableStatus = TableStatus.valueOf(status.toUpperCase());
        return tableRepository.findByStatus(tableStatus)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RestaurantTableDTO updateTable(Long id, RestaurantTableDTO dto) {
        RestaurantTable existing = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant Table", id));
        existing.setTableNumber(dto.getTableNumber());
        existing.setCapacity(dto.getCapacity());
        if (dto.getStatus() != null) {
            existing.setStatus(TableStatus.valueOf(dto.getStatus().toUpperCase()));
        }
        RestaurantTable updated = tableRepository.save(existing);
        logger.info("Updated restaurant table #{} (ID: {})", updated.getTableNumber(), updated.getId());
        return mapToDTO(updated);
    }

    @Override
    public RestaurantTableDTO occupyTable(Long id) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant Table", id));
        table.setStatus(TableStatus.OCCUPIED);
        RestaurantTable updated = tableRepository.save(table);
        logger.info("Table #{} is now OCCUPIED", updated.getTableNumber());
        return mapToDTO(updated);
    }

    @Override
    public RestaurantTableDTO freeTable(Long id) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant Table", id));
        table.setStatus(TableStatus.AVAILABLE);
        RestaurantTable updated = tableRepository.save(table);
        logger.info("Table #{} is now AVAILABLE", updated.getTableNumber());
        return mapToDTO(updated);
    }

    @Override
    public void deleteTable(Long id) {
        RestaurantTable existing = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant Table", id));
        tableRepository.delete(existing);
        logger.info("Deleted restaurant table with ID: {}", id);
    }

    // ── DTO ↔ Entity Mapping ──

    private RestaurantTableDTO mapToDTO(RestaurantTable entity) {
        RestaurantTableDTO dto = new RestaurantTableDTO();
        dto.setId(entity.getId());
        dto.setTableNumber(entity.getTableNumber());
        dto.setCapacity(entity.getCapacity());
        dto.setStatus(entity.getStatus().name());
        return dto;
    }

    private RestaurantTable mapToEntity(RestaurantTableDTO dto) {
        RestaurantTable entity = new RestaurantTable();
        entity.setTableNumber(dto.getTableNumber());
        entity.setCapacity(dto.getCapacity());
        if (dto.getStatus() != null) {
            entity.setStatus(TableStatus.valueOf(dto.getStatus().toUpperCase()));
        } else {
            entity.setStatus(TableStatus.AVAILABLE);
        }
        return entity;
    }
}
