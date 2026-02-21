package com.nsbm.group03.kitchenManagementService.exception;

public class MenuItemNotAvailableException extends RuntimeException {

    public MenuItemNotAvailableException(String message) {
        super(message);
    }

    public MenuItemNotAvailableException(Long menuItemId) {
        super("Menu item with id " + menuItemId + " is not available");
    }
}
