package com.nsbm.group03.restaurantManagementService.service;

import com.nsbm.group03.restaurantManagementService.dto.MenuItemDTO;

import java.util.List;

public interface MenuItemService {

    MenuItemDTO addMenuItem(MenuItemDTO dto);

    MenuItemDTO getMenuItemById(Long id);

    List<MenuItemDTO> getAllMenuItems();

    List<MenuItemDTO> getAvailableMenuItems();

    List<MenuItemDTO> getMenuItemsByCategory(String category);

    List<MenuItemDTO> searchMenuItemsByName(String name);

    MenuItemDTO updateMenuItem(Long id, MenuItemDTO dto);

    void deleteMenuItem(Long id);

    MenuItemDTO toggleAvailability(Long id);
}
