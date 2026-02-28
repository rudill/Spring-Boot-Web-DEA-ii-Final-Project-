package com.nsbm.group03.restaurantManagementService.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nsbm.group03.restaurantManagementService.dto.MenuItemDTO;
import com.nsbm.group03.restaurantManagementService.entity.MenuItem;
import com.nsbm.group03.restaurantManagementService.exception.DuplicateResourceException;
import com.nsbm.group03.restaurantManagementService.exception.ResourceNotFoundException;
import com.nsbm.group03.restaurantManagementService.repository.MenuItemRepository;

@Service
@Transactional
public class MenuItemService {

    private static final Logger logger = LoggerFactory.getLogger(MenuItemService.class);

    @Autowired
    private MenuItemRepository menuItemRepository;

    private MenuItemDTO convertToDTO(MenuItem item) {
        return new MenuItemDTO(
                item.getId(), item.getName(), item.getDescription(), item.getPrice(),
                item.getCategory(), item.getIsAvailable(), item.getPreparationTimeMinutes(),
                item.getImageUrl(), item.getIngredients()
        );
    }

    private MenuItem convertToEntity(MenuItemDTO dto) {
        MenuItem item = new MenuItem();
        item.setId(dto.getId());
        item.setName(dto.getName());
        item.setDescription(dto.getDescription());
        item.setPrice(dto.getPrice());
        item.setCategory(dto.getCategory());
        item.setIsAvailable(dto.getIsAvailable() != null ? dto.getIsAvailable() : true);
        item.setPreparationTimeMinutes(dto.getPreparationTimeMinutes());
        item.setImageUrl(dto.getImageUrl());
        item.setIngredients(dto.getIngredients());
        return item;
    }

    public MenuItemDTO createMenuItem(MenuItemDTO menuItemDTO) {
        logger.info("Creating new menu item: {}", menuItemDTO.getName());
        if (menuItemRepository.existsByName(menuItemDTO.getName())) {
            throw new DuplicateResourceException("Menu item with name '" + menuItemDTO.getName() + "' already exists");
        }
        MenuItem saved = menuItemRepository.save(convertToEntity(menuItemDTO));
        logger.info("Successfully created menu item with id: {}", saved.getId());
        return convertToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<MenuItemDTO> getAllMenuItems() {
        logger.info("Fetching all menu items");
        return menuItemRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<MenuItemDTO> getMenuItemById(Long id) {
        logger.info("Fetching menu item with id: {}", id);
        return menuItemRepository.findById(id).map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public List<MenuItemDTO> getMenuItemsByCategory(String category) {
        logger.info("Fetching menu items by category: {}", category);
        return menuItemRepository.findByCategory(category.toUpperCase())
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MenuItemDTO> getAvailableMenuItems() {
        logger.info("Fetching available menu items");
        return menuItemRepository.findByIsAvailable(true)
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MenuItemDTO> getAvailableMenuItemsByCategory(String category) {
        logger.info("Fetching available menu items by category: {}", category);
        return menuItemRepository.findByCategoryAndIsAvailable(category.toUpperCase(), true)
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MenuItemDTO> searchMenuItemsByName(String name) {
        logger.info("Searching menu items with name: {}", name);
        return menuItemRepository.findByNameContainingIgnoreCase(name)
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public MenuItemDTO updateMenuItem(Long id, MenuItemDTO menuItemDTO) {
        logger.info("Updating menu item with id: {}", id);
        MenuItem existing = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", id));
        if (!existing.getName().equals(menuItemDTO.getName()) && menuItemRepository.existsByName(menuItemDTO.getName())) {
            throw new DuplicateResourceException("Menu item with name '" + menuItemDTO.getName() + "' already exists");
        }
        existing.setName(menuItemDTO.getName());
        existing.setDescription(menuItemDTO.getDescription());
        existing.setPrice(menuItemDTO.getPrice());
        existing.setCategory(menuItemDTO.getCategory());
        existing.setIsAvailable(menuItemDTO.getIsAvailable() != null ? menuItemDTO.getIsAvailable() : existing.getIsAvailable());
        existing.setPreparationTimeMinutes(menuItemDTO.getPreparationTimeMinutes());
        existing.setImageUrl(menuItemDTO.getImageUrl());
        existing.setIngredients(menuItemDTO.getIngredients());
        MenuItem updated = menuItemRepository.save(existing);
        logger.info("Successfully updated menu item with id: {}", updated.getId());
        return convertToDTO(updated);
    }

    public MenuItemDTO updateAvailability(Long id, Boolean isAvailable) {
        logger.info("Updating availability for menu item id: {} to: {}", id, isAvailable);
        MenuItem existing = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", id));
        existing.setIsAvailable(isAvailable);
        return convertToDTO(menuItemRepository.save(existing));
    }

    public void deleteMenuItem(Long id) {
        logger.info("Deleting menu item with id: {}", id);
        if (!menuItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("MenuItem", "id", id);
        }
        menuItemRepository.deleteById(id);
        logger.info("Successfully deleted menu item with id: {}", id);
    }

    @Transactional(readOnly = true)
    public long countMenuItems() {
        return menuItemRepository.count();
    }

    @Transactional(readOnly = true)
    public long countAvailableMenuItems() {
        return menuItemRepository.findByIsAvailable(true).size();
    }
}
