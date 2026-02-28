package com.nsbm.group03.restaurantManagementService.config;

import com.nsbm.group03.restaurantManagementService.entity.MenuItem;
import com.nsbm.group03.restaurantManagementService.entity.RestaurantTable;
import com.nsbm.group03.restaurantManagementService.repository.MenuItemRepository;
import com.nsbm.group03.restaurantManagementService.repository.RestaurantTableRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private RestaurantTableRepository tableRepository;

    @Override
    public void run(String... args) throws Exception {
        if (menuItemRepository.count() > 0) {
            logger.info("Database already contains data. Skipping initialization.");
            return;
        }

        logger.info("Initializing database with sample restaurant data...");

        // Initialize Menu Items
        List<MenuItem> menuItems = Arrays.asList(
                // Appetizers
                new MenuItem("Spring Rolls", "Crispy vegetable spring rolls served with sweet chilli sauce",
                        850.0, "APPETIZER", true, 15, null, "Cabbage, Carrots, Bean Sprouts, Noodles"),
                new MenuItem("Bruschetta", "Toasted bread topped with fresh tomatoes, basil and garlic",
                        950.0, "APPETIZER", true, 10, null, "Tomatoes, Basil, Garlic, Olive Oil, Baguette"),
                new MenuItem("Calamari", "Lightly battered squid rings served with tartare sauce",
                        1200.0, "APPETIZER", true, 20, null, "Squid, Flour, Lemon, Tartare Sauce"),

                // Soups
                new MenuItem("Tomato Basil Soup", "Classic creamy tomato soup with fresh basil",
                        750.0, "SOUP", true, 10, null, "Tomatoes, Basil, Cream, Onion, Garlic"),
                new MenuItem("Mushroom Soup", "Rich and creamy wild mushroom soup",
                        850.0, "SOUP", true, 12, null, "Wild Mushrooms, Cream, Thyme, Garlic"),
                new MenuItem("Chicken Noodle Soup", "Light broth with tender chicken and noodles",
                        900.0, "SOUP", true, 15, null, "Chicken, Noodles, Vegetables, Herbs"),

                // Salads
                new MenuItem("Caesar Salad", "Romaine lettuce with Caesar dressing, croutons and parmesan",
                        1100.0, "SALAD", true, 10, null, "Romaine Lettuce, Caesar Dressing, Croutons, Parmesan"),
                new MenuItem("Greek Salad", "Fresh vegetables with feta cheese and olives",
                        1050.0, "SALAD", true, 8, null, "Tomatoes, Cucumber, Feta, Olives, Olive Oil"),

                // Main Courses
                new MenuItem("Grilled Salmon", "Atlantic salmon fillet grilled to perfection with lemon butter sauce",
                        2800.0, "MAIN_COURSE", true, 25, null, "Salmon, Lemon, Butter, Herbs, Capers"),
                new MenuItem("Chicken Tikka Masala", "Tender chicken in a rich spiced tomato cream sauce",
                        2200.0, "MAIN_COURSE", true, 30, null, "Chicken, Tomato, Cream, Spices, Onion"),
                new MenuItem("Beef Tenderloin", "Prime beef tenderloin with roasted vegetables and red wine sauce",
                        3800.0, "MAIN_COURSE", true, 35, null, "Beef Tenderloin, Red Wine, Mushrooms, Vegetables"),
                new MenuItem("Vegetable Pasta", "Penne pasta with seasonal vegetables in tomato basil sauce",
                        1800.0, "MAIN_COURSE", true, 20, null, "Penne, Vegetables, Tomato Sauce, Basil, Parmesan"),
                new MenuItem("Lamb Chops", "Herb-marinated lamb chops with mint jelly and roasted potatoes",
                        3500.0, "MAIN_COURSE", true, 35, null, "Lamb, Herbs, Garlic, Mint Jelly, Potatoes"),

                // Side Dishes
                new MenuItem("Garlic Bread", "Toasted bread with garlic butter and herbs",
                        450.0, "SIDE_DISH", true, 10, null, "Bread, Garlic, Butter, Herbs"),
                new MenuItem("Steamed Rice", "Fragrant jasmine steamed rice",
                        350.0, "SIDE_DISH", true, 15, null, "Jasmine Rice"),
                new MenuItem("French Fries", "Golden crispy seasoned french fries",
                        550.0, "SIDE_DISH", true, 15, null, "Potatoes, Oil, Salt, Seasoning"),

                // Desserts
                new MenuItem("Chocolate Lava Cake", "Warm chocolate cake with molten centre and vanilla ice cream",
                        1200.0, "DESSERT", true, 20, null, "Dark Chocolate, Flour, Eggs, Butter, Vanilla Ice Cream"),
                new MenuItem("Tiramisu", "Classic Italian dessert with mascarpone and coffee",
                        1050.0, "DESSERT", true, 5, null, "Mascarpone, Ladyfingers, Espresso, Cocoa"),
                new MenuItem("Creme Brulee", "Smooth vanilla custard with caramelised sugar crust",
                        1100.0, "DESSERT", true, 5, null, "Cream, Egg Yolks, Sugar, Vanilla"),

                // Beverages
                new MenuItem("Fresh Orange Juice", "Freshly squeezed orange juice",
                        550.0, "BEVERAGE", true, 5, null, "Oranges"),
                new MenuItem("Mango Lassi", "Creamy mango yoghurt drink",
                        500.0, "BEVERAGE", true, 5, null, "Mango, Yoghurt, Sugar, Cardamom"),
                new MenuItem("Mineral Water", "Still or sparkling mineral water",
                        250.0, "BEVERAGE", true, 1, null, "Mineral Water"),
                new MenuItem("Soft Drinks", "Choice of Coca-Cola, Sprite, Fanta",
                        300.0, "BEVERAGE", true, 2, null, "Carbonated Soft Drink"),

                // Specials
                new MenuItem("Chef's Special Seafood Platter", "A selection of today's fresh seafood grilled and steamed",
                        4500.0, "SPECIAL", true, 40, null, "Lobster, Prawns, Fish, Scallops, Vegetables"),
                new MenuItem("Sri Lankan Curry Buffet", "Authentic Sri Lankan curry selection with rice and accompaniments",
                        2500.0, "SPECIAL", true, 20, null, "Rice, Dhal, Fish Curry, Chicken Curry, Vegetables, Sambols")
        );

        menuItemRepository.saveAll(menuItems);
        logger.info("Successfully loaded {} menu items", menuItems.size());

        // Initialize Restaurant Tables
        List<RestaurantTable> tables = Arrays.asList(
                new RestaurantTable(1, 2, "AVAILABLE", "Indoor", "Cozy window table for two"),
                new RestaurantTable(2, 2, "AVAILABLE", "Indoor", "Intimate corner table"),
                new RestaurantTable(3, 4, "AVAILABLE", "Indoor", "Standard dining table"),
                new RestaurantTable(4, 4, "AVAILABLE", "Indoor", "Standard dining table"),
                new RestaurantTable(5, 4, "AVAILABLE", "Indoor", "Near the bar area"),
                new RestaurantTable(6, 6, "AVAILABLE", "Indoor", "Large family table"),
                new RestaurantTable(7, 6, "AVAILABLE", "Indoor", "Group dining table"),
                new RestaurantTable(8, 8, "AVAILABLE", "Indoor", "Private dining area"),
                new RestaurantTable(9, 2, "AVAILABLE", "Outdoor", "Garden terrace table for two"),
                new RestaurantTable(10, 2, "AVAILABLE", "Outdoor", "Poolside table"),
                new RestaurantTable(11, 4, "AVAILABLE", "Outdoor", "Terrace table with garden view"),
                new RestaurantTable(12, 4, "AVAILABLE", "Outdoor", "Terrace table with pool view"),
                new RestaurantTable(13, 6, "AVAILABLE", "Terrace", "Open terrace group table"),
                new RestaurantTable(14, 10, "AVAILABLE", "Private Room", "Private dining room - small"),
                new RestaurantTable(15, 20, "OUT_OF_SERVICE", "Private Room", "Private dining room - large (under renovation)")
        );

        tableRepository.saveAll(tables);
        logger.info("Successfully loaded {} restaurant tables", tables.size());

        logger.info("Database initialization complete!");
    }
}
