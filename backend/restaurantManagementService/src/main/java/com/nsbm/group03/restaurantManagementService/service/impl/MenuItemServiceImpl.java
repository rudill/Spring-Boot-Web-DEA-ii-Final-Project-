package com.nsbm.group03.restaurantManagementService.service.impl;

import com.nsbm.group03.restaurantManagementService.dto.MenuItemDTO;
import com.nsbm.group03.restaurantManagementService.entity.MenuItem;
import com.nsbm.group03.restaurantManagementService.exception.ResourceNotFoundException;
import com.nsbm.group03.restaurantManagementService.repository.MenuItemRepository;
import com.nsbm.group03.restaurantManagementService.service.MenuItemService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuItemServiceImpl implements MenuItemService {

    private static final Logger logger = LoggerFactory.getLogger(MenuItemServiceImpl.class);

    private final MenuItemRepository menuItemRepository;

    public MenuItemServiceImpl(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    @Override
    public MenuItemDTO addMenuItem(MenuItemDTO dto) {
        MenuItem entity = mapToEntity(dto);
        MenuItem saved = menuItemRepository.save(entity);
        logger.info("Added menu item: {} (ID: {})", saved.getName(), saved.getId());
        return mapToDTO(saved);
    }

    @Override
    public MenuItemDTO getMenuItemById(Long id) {
        MenuItem entity = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu Item", id));
        return mapToDTO(entity);
    }

    @Override
    public List<MenuItemDTO> getAllMenuItems() {
        return menuItemRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MenuItemDTO> getAvailableMenuItems() {
        return menuItemRepository.findByAvailableTrue()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MenuItemDTO> getMenuItemsByCategory(String category) {
        return menuItemRepository.findByCategory(category)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MenuItemDTO> searchMenuItemsByName(String name) {
        return menuItemRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MenuItemDTO updateMenuItem(Long id, MenuItemDTO dto) {
        MenuItem existing = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu Item", id));
        existing.setName(dto.getName());
        existing.setCategory(dto.getCategory());
        existing.setPrice(dto.getPrice());
        existing.setAvailable(dto.isAvailable());
        MenuItem updated = menuItemRepository.save(existing);
        logger.info("Updated menu item: {} (ID: {})", updated.getName(), updated.getId());
        return mapToDTO(updated);
    }

    @Override
    public void deleteMenuItem(Long id) {
        MenuItem existing = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu Item", id));
        menuItemRepository.delete(existing);
        logger.info("Deleted menu item with ID: {}", id);
    }

    @Override
    public MenuItemDTO toggleAvailability(Long id) {
        MenuItem entity = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu Item", id));
        entity.setAvailable(!entity.isAvailable());
        MenuItem updated = menuItemRepository.save(entity);
        logger.info("Toggled availability for menu item ID {}: now {}", id, updated.isAvailable());
        return mapToDTO(updated);
    }

    // ── DTO ↔ Entity Mapping ──

    private MenuItemDTO mapToDTO(MenuItem entity) {
        MenuItemDTO dto = new MenuItemDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setCategory(entity.getCategory());
        dto.setPrice(entity.getPrice());
        dto.setAvailable(entity.isAvailable());
        return dto;
    }

    private MenuItem mapToEntity(MenuItemDTO dto) {
        MenuItem entity = new MenuItem();
        entity.setName(dto.getName());
        entity.setCategory(dto.getCategory());
        entity.setPrice(dto.getPrice());
        entity.setAvailable(dto.isAvailable());
        return entity;
    }
}
